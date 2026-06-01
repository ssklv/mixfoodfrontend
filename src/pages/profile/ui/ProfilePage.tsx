import React, { useState, useEffect } from 'react';
import { api } from '@/shared/api/api';
import { useUserStore } from '@/entities/user/model/userSlice';
import './AuthModal.css';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Состояния формы
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Подключаем метод из глобального стора
  const setAuth = useUserStore((state) => state.setAuth);

  useEffect(() => {
    setMode(initialMode);
    setError(''); // Сбрасываем ошибку при смене режима
  }, [initialMode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Примитивная валидация (как просили в задании)
    if (!phone || !password) {
      setError('Заполните обязательные поля');
      return;
    }
    if (mode === 'register' && !name) {
      setError('Введите имя');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', { phone, password });
        // Успех: сохраняем токен
        setAuth(true, res.data.accessToken, 'Пользователь'); // Имя потом можно вытянуть с бэка
        onClose();
      } else {
        const res = await api.post('/auth/register', { phone, password, name });
        // Успех: сохраняем токен и имя
        setAuth(true, res.data.accessToken, name);
        onClose();
      }
    } catch (err: any) {
      // Обработка ошибок с бэкенда (твои ErrorResponse из Go)
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Что-то пошло не так. Проверьте соединение.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-logo-text">МиксФуд</div>

        <div className="auth-tabs">
          <span className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</span>
          <span className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Отображение ошибки */}
          {error && <div style={{ color: '#D9534F', fontSize: '16px', textAlign: 'center' }}>{error}</div>}

          <input 
            type="text" 
            placeholder="Имя" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`auth-input ${mode === 'login' ? 'hidden' : ''}`} 
          />
          <input 
            type="text" 
            placeholder="Телефон (например, 79991234567)" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="auth-input" 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input" 
          />

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="auth-footer-wrapper" onClick={toggleMode}>
          <div className="auth-divider"></div>
          <div className="auth-footer">
            {mode === 'login' ? 'Создать аккаунт' : 'Есть аккаунт? Войти'}
          </div>
        </div>
      </div>
    </div>
  );
};