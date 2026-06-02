package com.solux.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClienteDTO {

    private Long id;

    @NotNull(message = "ID da empresa é obrigatório")
    private Long idEmpresa;

    @NotBlank(message = "O nome do cliente é obrigatório")
    private String nome;

    @NotBlank(message = "O CPF/CNPJ é obrigatório")
    private String cpfCnpj;

    @Email(message = "Email inválido")
    private String email;

    private String telefone;

    private String endereco;

    @NotNull(message = "O tipo de cliente é obrigatório")
    private com.solux.api.enums.TipoCliente tipoCliente;

    @NotNull(message = "O status do cliente é obrigatório")
    private com.solux.api.enums.StatusCliente status;
}
