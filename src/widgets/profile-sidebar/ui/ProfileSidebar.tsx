import React from 'react';
import { useUserStore } from '@/entities/user/model/userStore';
import type { ProfileTab } from '../../../pages/profile/ui/ProfilePage';
import './ProfileSidebar.css';

interface ProfileSidebarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const { userName, userPhone, logout } = useUserStore();
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : '👤';

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <aside className="profile-sidebar">
      <div className="user-profile">
        <div className="user-avatar">{avatarLetter}</div>
        <div className="user-info">
          <p className="user-name">{userName || 'Гость'}</p>
          <p className="user-phone">{userPhone || '+7 (---) --- -- --'}</p>
        </div>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <nav className="account-nav">
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => onTabChange('orders')}
        >
          Заказы
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''} 
          onClick={() => onTabChange('history')}
        >
          История
        </button>
        <button 
          className={activeTab === 'data' ? 'active' : ''} 
          onClick={() => onTabChange('data')}
        >
          Данные
        </button>
        <button 
          className={activeTab === 'addresses' ? 'active' : ''} 
          onClick={() => onTabChange('addresses')}
        >
          Адреса
        </button>
      </nav>

      <div className="sidebar-divider"></div>
      
      <button className="logout-btn" onClick={handleLogout}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Выйти</span>
      </button>
    </aside>
  );
};