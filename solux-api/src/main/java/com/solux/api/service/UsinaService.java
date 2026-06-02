package com.solux.api.service;

import com.solux.api.dto.UsinaDTO;
import com.solux.api.entity.Empresa;
import com.solux.api.entity.Usina;
import com.solux.api.repository.EmpresaRepository;
import com.solux.api.repository.UsinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsinaService {

    private final UsinaRepository usinaRepository;
    private final EmpresaRepository empresaRepository;

    public UsinaDTO salvar(UsinaDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Empresa não encontrada"));

        Usina usina = new Usina();
        usina.setEmpresa(empresa);
        usina.setNome(dto.getNome());
        usina.setLocalizacao(dto.getLocalizacao());
        usina.setCapacidadeKwp(dto.getCapacidadeKwp());
        usina.setDistribuidora(dto.getDistribuidora());

        usina = usinaRepository.save(usina);
        dto.setId(usina.getId());
        return dto;
    }

    public List<UsinaDTO> listarTodas() {
        return usinaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UsinaDTO buscarPorId(Long id) {
        Usina usina = usinaRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Usina não encontrada"));
        return toDTO(usina);
    }

    private UsinaDTO toDTO(Usina usina) {
        UsinaDTO dto = new UsinaDTO();
        dto.setId(usina.getId());
        dto.setIdEmpresa(usina.getEmpresa().getId());
        dto.setNome(usina.getNome());
        dto.setLocalizacao(usina.getLocalizacao());
        dto.setCapacidadeKwp(usina.getCapacidadeKwp());
        dto.setDistribuidora(usina.getDistribuidora());
        return dto;
    }
}
