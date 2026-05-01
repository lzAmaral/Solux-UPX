package com.solux.api.repository;

import com.solux.api.entity.CreditoEnergia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditoEnergiaRepository extends JpaRepository<CreditoEnergia, Long> {
    
    Optional<CreditoEnergia> findByUnidadeConsumidoraIdAndMesReferenciaAndAnoReferencia(Long unidadeId, Integer mes, Integer ano);
}
