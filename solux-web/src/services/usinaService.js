import api from '../api/api';

export const usinaService = {
  getUsinas: async () => {
    const response = await api.get('/usinas');
    return response.data;
  },
  createUsina: async (data) => {
    const response = await api.post('/usinas', data);
    return response.data;
  }
};
