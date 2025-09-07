import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configurar axios para incluir o token nas requisições
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Funções de API
export const register = (name, email, password) => {
  return axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
};

export const login = (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, { email, password });
};

export const getTransactions = () => {
  return axios.get(`${API_BASE_URL}/transactions`);
};

export const createTransaction = (type, amount, category, description) => {
  return axios.post(`${API_BASE_URL}/transactions`, { type, amount, category, description });
};

export const getSummary = () => {
  return axios.get(`${API_BASE_URL}/transactions/summary`);
};

export const getUserProfile = () => {
  return axios.get(`${API_BASE_URL}/users/profile`);
};

export const updateTelegramId = (telegram_id) => {
  return axios.put(`${API_BASE_URL}/users/telegram`, { telegram_id });
};