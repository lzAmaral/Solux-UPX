package com.solux.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeracaoExportacaoDTO {
    private Long idUsina;
    private String nomeUsina;
    private Integer mes;
    private Integer ano;
    private BigDecimal energiaGeradaKwh;
    private BigDecimal tarifaKwh;
}
