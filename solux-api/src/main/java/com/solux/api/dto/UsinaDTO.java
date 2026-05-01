package com.solux.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UsinaDTO {

    private Long id;

    @NotNull(message = "ID da empresa é obrigatório")
    private Long idEmpresa;

    @NotBlank(message = "O nome da usina é obrigatório")
    private String nome;

    private String localizacao;

    @NotNull(message = "A capacidade é obrigatória")
    @DecimalMin(value = "0.0", inclusive = false, message = "A capacidade deve ser maior que zero")
    private BigDecimal capacidadeKwp;

    @NotBlank(message = "A distribuidora é obrigatória")
    private String distribuidora;
}
