-- ==========================================
-- CONSULTAS DE TESTE (Solux SaaS)
-- ==========================================

-- 1. Listar todos os clientes ativos
SELECT * 
FROM cliente 
WHERE status = 'ATIVO';

-- 2. Exportar dados da view (Pronto para CSV/Excel)
SELECT * 
FROM vw_exportacao_clientes;

-- 3. Buscar cliente por CPF/CNPJ (Exemplo genérico, você pode alterar o valor do LIKE)
SELECT * 
FROM vw_exportacao_clientes 
WHERE cpf_cnpj LIKE '%0001%';

-- 4. Ver economia total por cliente (Ordenado por quem economizou mais)
SELECT 
    nome_cliente, 
    tipo_cliente, 
    distribuidora, 
    economia_total
FROM vw_exportacao_clientes
ORDER BY economia_total DESC;

-- 5. Ver créditos por mês (Histórico de geração e rateio)
-- Exemplo focado na visão gerencial da Usina e Distribuição
SELECT 
    u.nome AS nome_usina,
    g.mes,
    g.ano,
    g.energia_gerada_kwh AS total_gerado,
    SUM(r.energia_creditada_kwh) AS total_distribuido
FROM geracao_mensal g
JOIN usina u ON g.id_usina = u.id_usina
JOIN rateio_mensal r ON g.id_geracao = r.id_geracao
GROUP BY u.nome, g.mes, g.ano, g.energia_gerada_kwh
ORDER BY g.ano, g.mes;

-- 6. Ver clientes com maior economia e maior saldo de crédito acumulado
SELECT 
    nome_cliente, 
    economia_total, 
    saldo_atual_kwh
FROM vw_exportacao_clientes
ORDER BY saldo_atual_kwh DESC
LIMIT 10;
