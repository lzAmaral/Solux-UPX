CREATE TABLE empresa (
    id_empresa BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20)
);

CREATE TABLE cliente (
    id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    CONSTRAINT fk_cliente_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE usina (
    id_usina BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255),
    capacidade_kwp DECIMAL(10,2),
    distribuidora VARCHAR(100),
    CONSTRAINT fk_usina_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE importacao_arquivo (
    id_importacao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_empresa BIGINT NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_arquivo VARCHAR(50),
    data_importacao DATETIME,
    status VARCHAR(50),
    CONSTRAINT fk_importacao_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE unidade_consumidora (
    id_unidade BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    numero_uc VARCHAR(50) NOT NULL,
    distribuidora VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    consumo_medio_kwh DECIMAL(10,2),
    percentual_rateio DECIMAL(5,2),
    CONSTRAINT fk_unidade_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

CREATE TABLE geracao_mensal (
    id_geracao BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usina BIGINT NOT NULL,
    mes INT NOT NULL,
    ano INT NOT NULL,
    energia_gerada_kwh DECIMAL(10,2),
    tarifa_kwh DECIMAL(10,4),
    CONSTRAINT fk_geracao_usina FOREIGN KEY (id_usina) REFERENCES usina (id_usina)
);

CREATE TABLE rateio_mensal (
    id_rateio BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_unidade BIGINT NOT NULL,
    id_geracao BIGINT NOT NULL,
    percentual_rateio DECIMAL(5,2),
    energia_creditada_kwh DECIMAL(10,2),
    valor_economizado DECIMAL(10,2),
    saldo_credito_kwh DECIMAL(10,2),
    CONSTRAINT fk_rateio_unidade FOREIGN KEY (id_unidade) REFERENCES unidade_consumidora (id_unidade),
    CONSTRAINT fk_rateio_geracao FOREIGN KEY (id_geracao) REFERENCES geracao_mensal (id_geracao)
);
