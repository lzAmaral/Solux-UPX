package com.solux.api.repository;

import com.solux.api.entity.ImportacaoArquivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportacaoArquivoRepository extends JpaRepository<ImportacaoArquivo, Long> {
}
