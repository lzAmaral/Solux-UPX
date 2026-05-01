import api from '../api/api';

export const clienteService = {
  getClientes: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getClienteById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  exportarClientes: async () => {
    const response = await api.get('/exportacao/clientes', {
      responseType: 'blob'
    });
    return response.data;
  }
};
