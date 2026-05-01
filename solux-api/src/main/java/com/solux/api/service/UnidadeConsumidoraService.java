package com.solux.api.service;

import com.solux.api.dto.UnidadeConsumidoraDTO;
import com.solux.api.entity.Cliente;
import com.solux.api.entity.UnidadeConsumidora;
import com.solux.api.repository.ClienteRepository;
import com.solux.api.repository.UnidadeConsumidoraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UnidadeConsumidoraService {

    private final UnidadeConsumidoraRepository unidadeConsumidoraRepository;
    private final ClienteRepository clienteRepository;

    public UnidadeConsumidoraDTO salvar(UnidadeConsumidoraDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Validar soma de 100%
        if (dto.getPercentualRateio() != null && dto.getPercentualRateio().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal somaAtual = unidadeConsumidoraRepository.sumPercentualByEmpresaAndDistribuidora(
                    cliente.getEmpresa().getId(), dto.getDistribuidora());

            // Se for atualização, precisa subtrair o valor antigo (não implementado aqui para simplificar a Fase 1)
            // No cenário de criação:
            if (somaAtual.add(dto.getPercentualRateio()).compareTo(new BigDecimal("100.00")) > 0) {
                throw new RuntimeException("A soma dos percentuais de rateio para a distribuidora " 
                        + dto.getDistribuidora() + " ultrapassa 100%. Saldo atual: " + somaAtual + "%");
            }
        }

        UnidadeConsumidora uc = new UnidadeConsumidora();
        uc.setCliente(cliente);
        uc.setNumeroUc(dto.getNumeroUc());
        uc.setDistribuidora(dto.getDistribuidora());
        uc.setCidade(dto.getCidade());
        uc.setEstado(dto.getEstado());
        uc.setConsumoMedioKwh(dto.getConsumoMedioKwh());
        uc.setPercentualRateio(dto.getPercentualRateio());

        uc = unidadeConsumidoraRepository.save(uc);
        dto.setId(uc.getId());
        return dto;
    }

    public List<UnidadeConsumidoraDTO> listarTodas() {
        return unidadeConsumidoraRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UnidadeConsumidoraDTO buscarPorId(Long id) {
        UnidadeConsumidora uc = unidadeConsumidoraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidade Consumidora não encontrada"));
        return toDTO(uc);
    }

    private UnidadeConsumidoraDTO toDTO(UnidadeConsumidora uc) {
        UnidadeConsumidoraDTO dto = new UnidadeConsumidoraDTO();
        dto.setId(uc.getId());
        dto.setIdCliente(uc.getCliente().getId());
        dto.setNumeroUc(uc.getNumeroUc());
        dto.setDistribuidora(uc.getDistribuidora());
        dto.setCidade(uc.getCidade());
        dto.setEstado(uc.getEstado());
        dto.setConsumoMedioKwh(uc.getConsumoMedioKwh());
        dto.setPercentualRateio(uc.getPercentualRateio());
        return dto;
    }
}
