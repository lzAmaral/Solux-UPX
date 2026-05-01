package com.solux.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usina")
public class Usina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usina")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @Column(nullable = false)
    private String nome;

    private String localizacao;

    @Column(name = "capacidade_kwp", precision = 10, scale = 2)
    private BigDecimal capacidadeKwp;

    @Column(length = 100)
    private String distribuidora;

    @OneToMany(mappedBy = "usina")
    private List<GeracaoMensal> geracoes;
}
