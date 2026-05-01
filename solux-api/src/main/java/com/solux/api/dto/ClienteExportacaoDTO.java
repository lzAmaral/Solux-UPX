package com.solux.api.dto;

import java.math.BigDecimal;

public interface ClienteExportacaoDTO {
    Long getIdCliente();
    String getNomeCliente();
    String getTipoCliente();
    String getCpfCnpj();
    String getEmail();
    String getTelefone();
    String getCidade();
    String getEstado();
    String getEndereco();
    String getNumeroUc();
    String getDistribuidora();
    BigDecimal getConsumoMedioKwh();
    BigDecimal getPercentualRateio();
    String getStatusCliente();
    BigDecimal getEconomiaTotal();
    BigDecimal getCreditoTotalKwh();
    BigDecimal getSaldoAtualKwh();
}
