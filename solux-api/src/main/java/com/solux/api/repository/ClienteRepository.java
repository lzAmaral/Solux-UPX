package com.solux.api.repository;

import com.solux.api.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query(value = "SELECT * FROM vw_exportacao_clientes", nativeQuery = true)
    List<com.solux.api.dto.ClienteExportacaoDTO> exportarDadosClientes();
}
