package com.solux.api.repository;

import com.solux.api.entity.Usina;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsinaRepository extends JpaRepository<Usina, Long> {

    @Override
    @EntityGraph(attributePaths = {"empresa"})
    List<Usina> findAll();
}
