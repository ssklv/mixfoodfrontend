import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Перехватчик запросов (добавляет токен)
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Перехватчик ответов (обрабатывает 401 ошибку)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если сервер говорит 401 — значит токен протух
    if (error.response?.status === 401) {
      sessionStorage.clear();
      // Можно сделать принудительный переход на страницу логина
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);