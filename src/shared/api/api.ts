import axios from 'axios';

// Настрой URL своего бэкенда (убедись, что порт правильный)
export const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Обязательно для httpOnly куки!
});

// Перехватчик: если у нас есть токен в памяти, добавляем его в заголовки
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});