ALTER TABLE cliente
ADD COLUMN tipo_cliente VARCHAR(20),
ADD COLUMN status VARCHAR(50) DEFAULT 'ATIVO';

CREATE VIEW vw_exportacao_clientes AS
SELECT 
    c.id_cliente,
    c.nome AS nome_cliente,
    c.tipo_cliente,
    c.cpf_cnpj,
    c.email,
    c.telefone,
    uc.cidade,
    uc.estado,
    c.endereco,
    uc.numero_uc,
    uc.distribuidora,
    uc.consumo_medio_kwh,
    uc.percentual_rateio,
    c.status AS status_cliente,
    COALESCE(SUM(rm.valor_economizado), 0) AS economia_total,
    COALESCE(SUM(rm.energia_creditada_kwh), 0) AS credito_total_kwh,
    COALESCE(MAX(ce.saldo_atual_kwh), 0) AS saldo_atual_kwh
FROM cliente c
JOIN unidade_consumidora uc ON c.id_cliente = uc.id_cliente
LEFT JOIN rateio_mensal rm ON uc.id_unidade = rm.id_unidade
LEFT JOIN credito_energia ce ON uc.id_unidade = ce.id_unidade
GROUP BY 
    c.id_cliente, c.nome, c.tipo_cliente, c.cpf_cnpj, c.email, c.telefone,
    uc.cidade, uc.estado, c.endereco, uc.numero_uc, uc.distribuidora,
    uc.consumo_medio_kwh, uc.percentual_rateio, c.status;
