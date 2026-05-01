package com.solux.api.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UnidadeConsumidoraDTO {

    private Long id;

    @NotNull(message = "ID do cliente é obrigatório")
    private Long idCliente;

    @NotBlank(message = "O número da UC é obrigatório")
    private String numeroUc;

    @NotBlank(message = "A distribuidora é obrigatória")
    private String distribuidora;

    private String cidade;

    private String estado;

    @NotNull(message = "O consumo médio é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "O consumo médio deve ser maior que zero")
    private BigDecimal consumoMedioKwh;

    @NotNull(message = "O percentual de rateio é obrigatório")
    @DecimalMin(value = "0.0", inclusive = true, message = "O percentual de rateio não pode ser negativo")
    @DecimalMax(value = "100.0", inclusive = true, message = "O percentual de rateio não pode ser maior que 100")
    private BigDecimal percentualRateio;
}
