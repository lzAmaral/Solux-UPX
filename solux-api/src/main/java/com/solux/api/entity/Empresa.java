package com.solux.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, length = 20)
    private String cnpj;

    private String email;

    @Column(length = 20)
    private String telefone;

    @OneToMany(mappedBy = "empresa")
    private List<Cliente> clientes;

    @OneToMany(mappedBy = "empresa")
    private List<Usina> usinas;

    @OneToMany(mappedBy = "empresa")
    private List<ImportacaoArquivo> importacoes;
}
