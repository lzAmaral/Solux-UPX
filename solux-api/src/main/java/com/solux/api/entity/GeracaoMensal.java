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
@Table(name = "geracao_mensal")
public class GeracaoMensal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_geracao")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usina", nullable = false)
    private Usina usina;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private Integer ano;

    @Column(name = "energia_gerada_kwh", precision = 10, scale = 2)
    private BigDecimal energiaGeradaKwh;

    @Column(name = "tarifa_kwh", precision = 10, scale = 4)
    private BigDecimal tarifaKwh;

    @OneToMany(mappedBy = "geracao")
    private List<RateioMensal> rateios;
}
