import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../entities/user/model/userStore';
import { apiClient } from '../../shared/api/apiClient';
import './AuthModal.css';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const setAuth = useUserStore((state) => state.setAuth);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setActiveTab(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, ''); 

    try {
      if (activeTab === 'login') {
        const response = await apiClient.post('/auth/login', {
          phone: cleanPhone,
          password,
        });
        
        // ИСПРАВЛЕНО: Сразу ставим имя "Пользователь", чтобы шапка мгновенно обновилась при логине
        setAuth(response.data.accessToken, 'Пользователь'); 
      } else {
        const response = await apiClient.post('/auth/register', {
          phone: cleanPhone,
          password,
          name,
        });
        
        setAuth(response.data.accessToken, name);
      }

      // ИСПРАВЛЕНО: Заворачиваем запрос профиля в try/catch, чтобы падение 404/500 не сбрасывало успешный вход
      try {
        await fetchProfile();
      } catch (profileErr) {
        console.warn('Эндпоинт получения профиля еще не готов на бэкенде:', profileErr);
      }

      onClose();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError('Ошибка соединения с сервером');
      }
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h1 className="auth-logo">МиксФуд</h1>
        
        <div className="auth-tabs">
          <span 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Войти
          </span>
          <span 
            className={activeTab === 'register' ? 'active' : ''} 
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Регистрация
          </span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="input-wrapper">
              <span className="placeholder-text">Имя</span>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="input-wrapper">
            <span className="placeholder-text">Телефон</span>
            <input 
              type="tel" 
              placeholder="+7 (999) 123-45-67"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
            />
          </div>

          <div className="input-wrapper">
            <span className="placeholder-text">Пароль</span>
            <input 
              type="text" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            {activeTab === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <hr className="auth-divider" />
        <div className="auth-footer underline-text" onClick={onClose}>
          Назад на главную
        </div>
      </div>
    </div>
  );
};