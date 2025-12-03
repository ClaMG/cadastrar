import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Adiciona um interceptor de requisição
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      // Configura o cabeçalho Authorization para cada requisição
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Adiciona um interceptor de resposta para capturar 401 globalmente
api.interceptors.response.use(
  response => response,
  error => {
    // Se o erro for 401, você pode forçar o logout aqui (opcional)
    if (error.response && error.response.status === 401) {
      // Essa lógica de logout agora pode ser centralizada aqui, 
      // embora no seu componente (HomeAdm) você já a trate.
      console.log("Interceptor: 401 detectado, token inválido.");
    }
    return Promise.reject(error);
  }
);

export default api;