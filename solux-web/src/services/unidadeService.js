import api from '../api/api';

export const unidadeService = {
  getUnidades: async () => {
    const response = await api.get('/unidades');
    return response.data;
  },
  createUnidade: async (data) => {
    const response = await api.post('/unidades', data);
    return response.data;
  }
};
