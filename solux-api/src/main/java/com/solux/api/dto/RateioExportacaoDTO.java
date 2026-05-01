package com.solux.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateioExportacaoDTO {
    private String nomeCliente;
    private String cpfCnpj;
    private String numeroUc;
    private String distribuidora;
    private Integer mes;
    private Integer ano;
    private BigDecimal energiaCreditadaKwh;
    private BigDecimal tarifaKwh;
    private BigDecimal valorEconomizado;
    private BigDecimal saldoCreditoKwh;
}
