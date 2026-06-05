import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../entities/user/model/userStore';
import { apiClient } from '../../shared/api/apiClient';
import './AuthModal.css';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
}

interface FieldError {
  phone?: string;
  password?: string;
  name?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose }) => {
  const setAuth = useUserStore((state) => state.setAuth);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialMode);
    setFieldErrors({});
    setGeneralError('');
  }, [initialMode]);

  const validateForm = (): boolean => {
    const errors: FieldError = {};
    
    const phoneDigits = phone;
    if (!phoneDigits || phoneDigits.length < 10) {
      errors.phone = 'Введите 10 цифр номера телефона';
    } else if (phoneDigits.length > 11) {
      errors.phone = 'Номер телефона слишком длинный (максимум 11 цифр)';
    }

    if (!password) {
      errors.password = 'Введите пароль';
    } else if (password.length < 4) {
      errors.password = 'Пароль должен содержать минимум 4 символа';
    }

    if (activeTab === 'register') {
      if (!name.trim()) {
        errors.name = 'Введите ваше имя';
      } else if (name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
      } else if (name.trim().length > 30) {
        errors.name = 'Имя не должно превышать 30 символов';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await apiClient.post('/auth/login', {
          phone,
          password,
        });
        setAuth(response.data.accessToken, response.data.name || 'Пользователь');
      } else {
        const response = await apiClient.post('/auth/register', {
          phone,
          password,
          name: name.trim(),
        });
        setAuth(response.data.accessToken, name.trim());
      }

      try {
        await fetchProfile();
      } catch (profileErr) {
        console.warn('Profile fetch error:', profileErr);
      }

      onClose();
    } catch (err: any) {
      if (err.response && err.response.data) {
        const serverError = err.response.data.error || err.response.data.message;
        if (typeof serverError === 'string') {
          const lowerError = serverError.toLowerCase();
          if (lowerError.includes('phone') || lowerError.includes('номер')) {
            setFieldErrors(prev => ({ ...prev, phone: serverError }));
          } else if (lowerError.includes('password') || lowerError.includes('пароль')) {
            setFieldErrors(prev => ({ ...prev, password: serverError }));
          } else if (lowerError.includes('name') || lowerError.includes('имя')) {
            setFieldErrors(prev => ({ ...prev, name: serverError }));
          } else {
            setGeneralError(serverError);
          }
        } else {
          setGeneralError('Ошибка при авторизации');
        }
      } else {
        setGeneralError('Ошибка соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h1 className="auth-logo">МиксФуд</h1>
        
        <div className="auth-tabs">
          <span 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => { setActiveTab('login'); setFieldErrors({}); setGeneralError(''); }}
          >
            Войти
          </span>
          <span 
            className={activeTab === 'register' ? 'active' : ''} 
            onClick={() => { setActiveTab('register'); setFieldErrors({}); setGeneralError(''); }}
          >
            Регистрация
          </span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className={`input-wrapper ${fieldErrors.name ? 'has-error' : ''}`}>
              <span className="placeholder-text">Имя</span>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                disabled={isLoading}
              />
              {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
            </div>
          )}

          <div className={`input-wrapper ${fieldErrors.phone ? 'has-error' : ''}`}>
            <span className="placeholder-text">Телефон</span>
            <input 
              type="tel" 
              placeholder="+7 (999) 123-45-67"
              value={phone} 
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, '');
                setPhone(onlyDigits);
              }} 
              required 
              disabled={isLoading}
            />
            {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
          </div>

          <div className={`input-wrapper ${fieldErrors.password ? 'has-error' : ''}`}>
            <span className="placeholder-text">Пароль</span>
            <input 
              type="text"     
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
            />
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          {generalError && <div className="auth-error">{generalError}</div>}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Загрузка' : (activeTab === 'login' ? 'Войти' : 'Создать аккаунт')}
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