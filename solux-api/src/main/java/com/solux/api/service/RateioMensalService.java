package com.solux.api.service;

import com.solux.api.dto.RateioMensalDTO;
import com.solux.api.entity.RateioMensal;
import com.solux.api.repository.RateioMensalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RateioMensalService {

    private final RateioMensalRepository rateioMensalRepository;

    public List<RateioMensalDTO> listarTodos() {
        return rateioMensalRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private RateioMensalDTO toDTO(RateioMensal rateio) {
        RateioMensalDTO dto = new RateioMensalDTO();
        dto.setId(rateio.getId());
        dto.setIdUnidade(rateio.getUnidadeConsumidora().getId());
        dto.setIdGeracao(rateio.getGeracao().getId());
        dto.setPercentualRateio(rateio.getPercentualRateio());
        dto.setEnergiaCreditadaKwh(rateio.getEnergiaCreditadaKwh());
        dto.setValorEconomizado(rateio.getValorEconomizado());
        dto.setSaldoCreditoKwh(rateio.getSaldoCreditoKwh());
        return dto;
    }
}
