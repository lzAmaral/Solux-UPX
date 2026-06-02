package com.solux.api.service;

import com.solux.api.dto.ClienteDTO;
import com.solux.api.entity.Cliente;
import com.solux.api.entity.Empresa;
import com.solux.api.repository.ClienteRepository;
import com.solux.api.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;

    public ClienteDTO salvar(ClienteDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getIdEmpresa())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Empresa não encontrada"));

        Cliente cliente = new Cliente();
        cliente.setEmpresa(empresa);
        cliente.setNome(dto.getNome());
        cliente.setCpfCnpj(dto.getCpfCnpj());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        cliente.setTipoCliente(dto.getTipoCliente());
        cliente.setStatus(dto.getStatus() != null ? dto.getStatus() : com.solux.api.enums.StatusCliente.ATIVO);

        cliente = clienteRepository.save(cliente);
        dto.setId(cliente.getId());
        return dto;
    }

    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Cliente não encontrado"));
        return toDTO(cliente);
    }

    private ClienteDTO toDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setIdEmpresa(cliente.getEmpresa().getId());
        dto.setNome(cliente.getNome());
        dto.setCpfCnpj(cliente.getCpfCnpj());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setEndereco(cliente.getEndereco());
        dto.setTipoCliente(cliente.getTipoCliente());
        dto.setStatus(cliente.getStatus());
        return dto;
    }
}
