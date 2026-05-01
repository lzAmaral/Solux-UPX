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
@Table(name = "unidade_consumidora")
public class UnidadeConsumidora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidade")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "numero_uc", nullable = false, length = 50)
    private String numeroUc;

    @Column(length = 100)
    private String distribuidora;

    @Column(length = 100)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(name = "consumo_medio_kwh", precision = 10, scale = 2)
    private BigDecimal consumoMedioKwh;

    @Column(name = "percentual_rateio", precision = 5, scale = 2)
    private BigDecimal percentualRateio;

    @OneToMany(mappedBy = "unidadeConsumidora")
    private List<RateioMensal> rateios;
}
