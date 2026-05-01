package com.solux.api.service;

import com.solux.api.dto.EmpresaDTO;
import com.solux.api.entity.Empresa;
import com.solux.api.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaDTO salvar(EmpresaDTO dto) {
        Empresa empresa = new Empresa();
        empresa.setNome(dto.getNome());
        empresa.setCnpj(dto.getCnpj());
        empresa.setEmail(dto.getEmail());
        empresa.setTelefone(dto.getTelefone());

        empresa = empresaRepository.save(empresa);
        dto.setId(empresa.getId());
        return dto;
    }

    public List<EmpresaDTO> listarTodas() {
        return empresaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public EmpresaDTO buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        return toDTO(empresa);
    }

    private EmpresaDTO toDTO(Empresa empresa) {
        EmpresaDTO dto = new EmpresaDTO();
        dto.setId(empresa.getId());
        dto.setNome(empresa.getNome());
        dto.setCnpj(empresa.getCnpj());
        dto.setEmail(empresa.getEmail());
        dto.setTelefone(empresa.getTelefone());
        return dto;
    }
}
