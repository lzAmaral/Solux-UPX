package com.solux.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rateio_mensal")
public class RateioMensal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rateio")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_unidade", nullable = false)
    private UnidadeConsumidora unidadeConsumidora;

    @ManyToOne
    @JoinColumn(name = "id_geracao", nullable = false)
    private GeracaoMensal geracao;

    @Column(name = "percentual_rateio", precision = 5, scale = 2)
    private BigDecimal percentualRateio;

    @Column(name = "energia_creditada_kwh", precision = 10, scale = 2)
    private BigDecimal energiaCreditadaKwh;

    @Column(name = "valor_economizado", precision = 10, scale = 2)
    private BigDecimal valorEconomizado;

    @Column(name = "saldo_credito_kwh", precision = 10, scale = 2)
    private BigDecimal saldoCreditoKwh;
}
