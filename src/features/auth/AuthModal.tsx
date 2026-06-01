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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useUserStore((state) => state.setAuth);

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { phone, password } : { name, phone, password };
      const res = await api.post(endpoint, payload);
      
      // Выводим ответ, чтобы убедиться, что имя приходит
      console.log('Ответ сервера:', res.data);
      
      const fetchedName = res.data.name || res.data.userName || 'Пользователь';
      setAuth(true, res.data.accessToken, fetchedName);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка соединения');
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
          {error && <div className="auth-error" style={{ color: '#D9534F', textAlign: 'center' }}>{error}</div>}
          <input 
            type="text" placeholder="Имя" className={`auth-input ${mode === 'login' ? 'hidden' : ''}`}
            value={name} onChange={(e) => setName(e.target.value)} required={mode === 'register'} 
          />
          <input type="text" placeholder="Телефон" className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input type="text" placeholder="Пароль" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        <div className="auth-footer-wrapper" onClick={toggleMode}>
          <div className="auth-divider"></div>
          <div className="auth-footer">{mode === 'login' ? 'Создать аккаунт' : 'Есть аккаунт? Войти'}</div>
        </div>
      </div>
    </div>
  );
};