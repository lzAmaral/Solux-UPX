package com.solux.api.service;

import com.solux.api.dto.GeracaoMensalDTO;
import com.solux.api.entity.GeracaoMensal;
import com.solux.api.entity.Usina;
import com.solux.api.repository.GeracaoMensalRepository;
import com.solux.api.repository.UsinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeracaoMensalService {

    private final GeracaoMensalRepository geracaoMensalRepository;
    private final UsinaRepository usinaRepository;
    private final RateioEngineService rateioEngineService;

    @Transactional
    public GeracaoMensalDTO registrarGeracaoERatear(GeracaoMensalDTO dto) {
        Usina usina = usinaRepository.findById(dto.getIdUsina())
                .orElseThrow(() -> new RuntimeException("Usina não encontrada"));

        GeracaoMensal geracao = new GeracaoMensal();
        geracao.setUsina(usina);
        geracao.setMes(dto.getMes());
        geracao.setAno(dto.getAno());
        geracao.setEnergiaGeradaKwh(dto.getEnergiaGeradaKwh());
        geracao.setTarifaKwh(dto.getTarifaKwh());

        geracao = geracaoMensalRepository.save(geracao);

        // Gatilho: Processa o rateio e atualiza o saldo de créditos automaticamente
        rateioEngineService.processarRateio(geracao);

        dto.setId(geracao.getId());
        return dto;
    }

    public List<GeracaoMensalDTO> listarTodas() {
        return geracaoMensalRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private GeracaoMensalDTO toDTO(GeracaoMensal geracao) {
        GeracaoMensalDTO dto = new GeracaoMensalDTO();
        dto.setId(geracao.getId());
        dto.setIdUsina(geracao.getUsina().getId());
        dto.setMes(geracao.getMes());
        dto.setAno(geracao.getAno());
        dto.setEnergiaGeradaKwh(geracao.getEnergiaGeradaKwh());
        dto.setTarifaKwh(geracao.getTarifaKwh());
        return dto;
    }
}
