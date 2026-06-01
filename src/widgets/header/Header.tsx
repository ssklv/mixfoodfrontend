import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { useUserStore } from '@/entities/user/model/userSlice';
import './Header.css';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Header = ({ onOpenAuth }: HeaderProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isAuth = useUserStore((state) => state.isAuth);
  const userName = useUserStore((state) => state.userName);

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-title">МиксФуд</div>
          <div className="logo-subtitle">От закусок до десертов</div>
        </div>
      </div>

      <div className="header-search">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          type="text" placeholder="Искать блюда" value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="clear-search" onClick={() => setSearchQuery('')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="header-actions">
        {isAuth ? (
          <Button variant="default" onClick={() => navigate('/profile')}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          >
            {userName || 'Пользователь'}
          </Button>
        ) : (
          <>
            <Button onClick={() => onOpenAuth('register')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>Регистрация</Button>
            <Button onClick={() => onOpenAuth('login')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}>Вход</Button>
          </>
        )}
        <Button variant="primary" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}>Корзина</Button>
      </div>
    </header>
  );
};