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
            // Como não temos a medição real mensal neste MVP, usamos o consumo médio para simular a sobra
            BigDecimal consumoSimulado = uc.getConsumoMedioKwh() != null ? uc.getConsumoMedioKwh() : BigDecimal.ZERO;
            
            BigDecimal sobra = energiaCreditada.subtract(consumoSimulado);
            
            // Busca ou inicializa a Conta Corrente (CreditoEnergia) da UC
            CreditoEnergia contaCorrente = creditoEnergiaRepository
                    .findByUnidadeConsumidoraIdAndMesReferenciaAndAnoReferencia(uc.getId(), geracao.getMes(), geracao.getAno())
                    .orElse(null);

            if (contaCorrente == null) {
                // Se não existe para esse mês, busca o saldo mais recente ou cria do zero
                // (Para simplificar no MVP, vamos apenas criar/atualizar um registro histórico do saldo)
                contaCorrente = new CreditoEnergia();
                contaCorrente.setUnidadeConsumidora(uc);
                contaCorrente.setMesReferencia(geracao.getMes());
                contaCorrente.setAnoReferencia(geracao.getAno());
                contaCorrente.setSaldoAtualKwh(BigDecimal.ZERO);
            }

            BigDecimal saldoFinal = contaCorrente.getSaldoAtualKwh();
            if (sobra.compareTo(BigDecimal.ZERO) > 0) {
                // Se sobrou energia no mês, acumula no saldo
                saldoFinal = saldoFinal.add(sobra);
            } else {
                // Se faltou (sobra negativa), abate do saldo existente se houver
                saldoFinal = saldoFinal.add(sobra);
                if (saldoFinal.compareTo(BigDecimal.ZERO) < 0) {
                    saldoFinal = BigDecimal.ZERO; // Cliente terá que pagar a diferença na conta de luz, saldo zera.
                }
            }

            contaCorrente.setSaldoAtualKwh(saldoFinal);
            contaCorrente.setDataAtualizacao(LocalDateTime.now());
            creditoEnergiaRepository.save(contaCorrente);

            // 5. Registra o histórico do Rateio
            RateioMensal rateio = new RateioMensal();
            rateio.setUnidadeConsumidora(uc);
            rateio.setGeracao(geracao);
            rateio.setPercentualRateio(percentual);
            rateio.setEnergiaCreditadaKwh(energiaCreditada);
            rateio.setValorEconomizado(valorEconomizado);
            rateio.setSaldoCreditoKwh(saldoFinal);
            
            rateioMensalRepository.save(rateio);
        }
    }
}
