import api from '../api/api';

export const dashboardService = {
  getStats: async () => {
    try {
      // Fazemos as chamadas em paralelo para otimizar
      const [clientesRes, usinasRes, geracaoRes, rateiosRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/usinas'),
        api.get('/geracao'),
        api.get('/rateios')
      ]);

      const clientes = clientesRes.data || [];
      const usinas = usinasRes.data || [];
      const geracao = geracaoRes.data || [];
      const rateios = rateiosRes.data || [];

      // Agregações básicas
      const clientesAtivos = clientes.filter(c => c.status === 'ATIVO').length;
      
      const energiaTotalGerada = geracao.reduce((acc, curr) => acc + (curr.energiaGeradaKwh || 0), 0);
      
      const economiaTotal = rateios.reduce((acc, curr) => acc + (curr.valorEconomizado || 0), 0);
      const creditosDistribuidos = rateios.reduce((acc, curr) => acc + (curr.energiaCreditadaKwh || 0), 0);

      // Agrupamento para gráfico de geração por mês
      const geracaoPorMesMap = geracao.reduce((acc, curr) => {
        const key = `${curr.ano}-${String(curr.mes).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + curr.energiaGeradaKwh;
        return acc;
      }, {});

      const geracaoChartData = Object.keys(geracaoPorMesMap)
        .sort()
        .map(key => ({
          name: key,
          geracao: geracaoPorMesMap[key]
        }));

      // Top 5 Clientes (apenas simulando baseado em quem mais economizou no total dos rateios)
      const economiaPorCliente = rateios.reduce((acc, curr) => {
        // Precisamos do nome do cliente, mas no rateio só temos idUnidade. 
        // No mundo real teríamos o DTO completo, aqui vamos simplificar agrupando por ID da unidade (ou id)
        acc[curr.idUnidade] = (acc[curr.idUnidade] || 0) + curr.valorEconomizado;
        return acc;
      }, {});

      const topClientes = Object.entries(economiaPorCliente)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, valor]) => ({
          name: `Unidade ${id}`,
          valor: parseFloat(valor.toFixed(2))
        }));

      return {
        totalClientes: clientes.length,
        clientesAtivos,
        totalUsinas: usinas.length,
        energiaTotalGerada,
        economiaTotal,
        creditosDistribuidos,
        geracaoChartData,
        topClientes
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }
};
