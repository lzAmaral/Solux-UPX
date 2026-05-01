package com.solux.api.repository;

import com.solux.api.entity.UnidadeConsumidora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface UnidadeConsumidoraRepository extends JpaRepository<UnidadeConsumidora, Long> {

    @Query("SELECT COALESCE(SUM(u.percentualRateio), 0) FROM UnidadeConsumidora u WHERE u.cliente.empresa.id = :empresaId AND u.distribuidora = :distribuidora")
    BigDecimal sumPercentualByEmpresaAndDistribuidora(@Param("empresaId") Long empresaId, @Param("distribuidora") String distribuidora);

    List<UnidadeConsumidora> findByCliente_Empresa_IdAndDistribuidora(Long empresaId, String distribuidora);
}
