package com.solux.api.repository;

import com.solux.api.entity.Usina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsinaRepository extends JpaRepository<Usina, Long> {
}
