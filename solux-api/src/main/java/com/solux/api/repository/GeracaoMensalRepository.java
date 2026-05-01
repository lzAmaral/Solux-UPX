package com.solux.api.repository;

import com.solux.api.entity.GeracaoMensal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.solux.api.dto.GeracaoExportacaoDTO;
import java.util.List;

@Repository
public interface GeracaoMensalRepository extends JpaRepository<GeracaoMensal, Long> {

    @Query("SELECT new com.solux.api.dto.GeracaoExportacaoDTO(" +
           "u.id, u.nome, g.mes, g.ano, g.energiaGeradaKwh, g.tarifaKwh) " +
           "FROM GeracaoMensal g " +
           "JOIN g.usina u " +
           "ORDER BY g.ano DESC, g.mes DESC, u.nome ASC")
    List<GeracaoExportacaoDTO> exportarGeracaoMensal();
}
