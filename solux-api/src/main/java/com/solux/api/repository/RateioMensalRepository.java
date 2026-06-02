package com.solux.api.repository;

import com.solux.api.entity.RateioMensal;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateioMensalRepository extends JpaRepository<RateioMensal, Long> {

    @Override
    @EntityGraph(attributePaths = {"unidadeConsumidora", "geracao"})
    List<RateioMensal> findAll();

    @Query("SELECT new com.solux.api.dto.RateioExportacaoDTO(" +
           "c.nome, c.cpfCnpj, uc.numeroUc, uc.distribuidora, " +
           "g.mes, g.ano, r.energiaCreditadaKwh, g.tarifaKwh, r.valorEconomizado, r.saldoCreditoKwh) " +
           "FROM RateioMensal r " +
           "JOIN r.unidadeConsumidora uc " +
           "JOIN uc.cliente c " +
           "JOIN r.geracao g " +
           "WHERE g.mes = :mes AND g.ano = :ano")
    List<com.solux.api.dto.RateioExportacaoDTO> exportarRateiosPorMesEAno(@Param("mes") Integer mes, @Param("ano") Integer ano);
}
