CREATE TABLE credito_energia (
    id_credito BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_unidade BIGINT NOT NULL,
    saldo_atual_kwh DECIMAL(10,2) DEFAULT 0.00,
    mes_referencia INT NOT NULL,
    ano_referencia INT NOT NULL,
    data_atualizacao DATETIME,
    CONSTRAINT fk_credito_unidade FOREIGN KEY (id_unidade) REFERENCES unidade_consumidora (id_unidade)
);
