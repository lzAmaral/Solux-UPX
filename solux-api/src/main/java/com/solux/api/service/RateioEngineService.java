package com.solux.api.service;

import com.solux.api.entity.*;
import com.solux.api.repository.CreditoEnergiaRepository;
import com.solux.api.repository.RateioMensalRepository;
import com.solux.api.repository.UnidadeConsumidoraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RateioEngineService {

    private final UnidadeConsumidoraRepository unidadeConsumidoraRepository;
    private final RateioMensalRepository rateioMensalRepository;
    private final CreditoEnergiaRepository creditoEnergiaRepository;

    @Transactional
    public void processarRateio(GeracaoMensal geracao) {
        Usina usina = geracao.getUsina();
        Long idEmpresa = usina.getEmpresa().getId();
        String distribuidora = usina.getDistribuidora();

        // 1. Busca todas as UCs aptas para receber energia desta Usina
        List<UnidadeConsumidora> ucs = unidadeConsumidoraRepository
                .findByCliente_Empresa_IdAndDistribuidora(idEmpresa, distribuidora);

        BigDecimal energiaGerada = geracao.getEnergiaGeradaKwh();
        BigDecimal tarifa = geracao.getTarifaKwh();

        List<Long> ucIds = ucs.stream().map(UnidadeConsumidora::getId).collect(java.util.stream.Collectors.toList());
        java.util.Map<Long, CreditoEnergia> contaCorrenteMap = creditoEnergiaRepository
                .findByUnidadeConsumidoraIdInAndMesReferenciaAndAnoReferencia(ucIds, geracao.getMes(), geracao.getAno())
                .stream()
                .collect(java.util.stream.Collectors.toMap(c -> c.getUnidadeConsumidora().getId(), c -> c));

        List<CreditoEnergia> creditosParaSalvar = new java.util.ArrayList<>();
        List<RateioMensal> rateiosParaSalvar = new java.util.ArrayList<>();

        for (UnidadeConsumidora uc : ucs) {
            BigDecimal percentual = uc.getPercentualRateio();
            
            if (percentual == null || percentual.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // 2. Calcula a energia creditada para esta UC
            BigDecimal fracao = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
            BigDecimal energiaCreditada = energiaGerada.multiply(fracao).setScale(2, RoundingMode.HALF_UP);
            
            // 3. Calcula o valor economizado (R$)
            BigDecimal valorEconomizado = energiaCreditada.multiply(tarifa).setScale(2, RoundingMode.HALF_UP);

            // 4. Lógica de Consumo e Sobra de Créditos
            BigDecimal consumoSimulado = uc.getConsumoMedioKwh() != null ? uc.getConsumoMedioKwh() : BigDecimal.ZERO;
            
            BigDecimal sobra = energiaCreditada.subtract(consumoSimulado);
            
            CreditoEnergia contaCorrente = contaCorrenteMap.get(uc.getId());

            if (contaCorrente == null) {
                contaCorrente = new CreditoEnergia();
                contaCorrente.setUnidadeConsumidora(uc);
                contaCorrente.setMesReferencia(geracao.getMes());
                contaCorrente.setAnoReferencia(geracao.getAno());
                contaCorrente.setSaldoAtualKwh(BigDecimal.ZERO);
            }

            BigDecimal saldoFinal = contaCorrente.getSaldoAtualKwh();
            if (sobra.compareTo(BigDecimal.ZERO) > 0) {
                saldoFinal = saldoFinal.add(sobra);
            } else {
                saldoFinal = saldoFinal.add(sobra);
                if (saldoFinal.compareTo(BigDecimal.ZERO) < 0) {
                    saldoFinal = BigDecimal.ZERO;
                }
            }

            contaCorrente.setSaldoAtualKwh(saldoFinal);
            contaCorrente.setDataAtualizacao(LocalDateTime.now());
            creditosParaSalvar.add(contaCorrente);

            // 5. Registra o histórico do Rateio
            RateioMensal rateio = new RateioMensal();
            rateio.setUnidadeConsumidora(uc);
            rateio.setGeracao(geracao);
            rateio.setPercentualRateio(percentual);
            rateio.setEnergiaCreditadaKwh(energiaCreditada);
            rateio.setValorEconomizado(valorEconomizado);
            rateio.setSaldoCreditoKwh(saldoFinal);
            
            rateiosParaSalvar.add(rateio);
        }

        creditoEnergiaRepository.saveAll(creditosParaSalvar);
        rateioMensalRepository.saveAll(rateiosParaSalvar);
    }
}
