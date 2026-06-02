import api from '../api/api';

export const geracaoService = {
  getGeracao: async () => {
    const response = await api.get('/geracao');
    return response.data;
  },
  createGeracao: async (data) => {
    const response = await api.post('/geracao', data);
    return response.data;
  }
};
