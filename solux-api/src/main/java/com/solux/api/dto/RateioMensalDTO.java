package com.solux.api.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RateioMensalDTO {

    private Long id;
    private Long idUnidade;
    private Long idGeracao;
    private BigDecimal percentualRateio;
    private BigDecimal energiaCreditadaKwh;
    private BigDecimal valorEconomizado;
    private BigDecimal saldoCreditoKwh;
}
