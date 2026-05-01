import api from '../api/api';

export const exportacaoService = {
  exportarRateiosMensal: async (mes, ano) => {
    const response = await api.get('/exportacao/rateios', {
      params: { mes, ano },
      responseType: 'blob'
    });
    return response.data;
  },
  exportarGeracaoMensal: async () => {
    const response = await api.get('/exportacao/geracao/mensal', {
      responseType: 'blob'
    });
    return response.data;
  },
  exportarGeracaoDiaria: async (idUsina) => {
    const response = await api.get('/exportacao/geracao/diaria', {
      params: { idUsina },
      responseType: 'blob'
    });
    return response.data;
  }
};
