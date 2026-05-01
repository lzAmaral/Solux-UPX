import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token no futuro
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Configuração temporária para bypass no Spring Security
    // O Spring Security gerou um login básico, usamos basic auth para testar sem JWT:
    // User: user, Password: <generated-password>
    // A senha real foi logada no Spring Boot, o ideal é o user preencher no form de login.
    // Como a senha muda a cada restart, para simulação local, nós passaremos ela caso informada no AuthContext.
    
    const basicAuthToken = localStorage.getItem('basicAuthToken');
    if (basicAuthToken) {
      config.headers.Authorization = `Basic ${basicAuthToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
