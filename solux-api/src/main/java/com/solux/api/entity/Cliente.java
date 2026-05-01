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
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(nullable = false)
    private String nome;

    @Column(name = "cpf_cnpj", nullable = false, length = 20)
    private String cpfCnpj;

    private String email;

    @Column(length = 20)
    private String telefone;

    private String endereco;

    @Column(name = "tipo_cliente", length = 20)
    private String tipoCliente;

    @Column(length = 50)
    private String status;

    @OneToMany(mappedBy = "cliente")
    private List<UnidadeConsumidora> unidadesConsumidoras;
}
