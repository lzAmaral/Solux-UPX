package com.solux.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GeracaoMensalDTO {

    private Long id;

    @NotNull(message = "ID da usina é obrigatório")
    private Long idUsina;

    @NotNull(message = "O mês é obrigatório")
    @Min(value = 1, message = "O mês deve ser entre 1 e 12")
    @Max(value = 12, message = "O mês deve ser entre 1 e 12")
    private Integer mes;

    @NotNull(message = "O ano é obrigatório")
    private Integer ano;

    @NotNull(message = "A energia gerada é obrigatória")
    @DecimalMin(value = "0.0", inclusive = false, message = "A energia gerada deve ser maior que zero")
    private BigDecimal energiaGeradaKwh;

    @NotNull(message = "A tarifa é obrigatória")
    @DecimalMin(value = "0.0", inclusive = false, message = "A tarifa deve ser maior que zero")
    private BigDecimal tarifaKwh;
}
