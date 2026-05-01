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

    private String tipoCliente;

    private String status;
}
