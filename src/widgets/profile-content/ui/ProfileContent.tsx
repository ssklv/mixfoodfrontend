import React from 'react';
import type { ProfileTab } from '@/pages/profile/ui/ProfilePage';
import { Button } from '@/shared/ui/Button/Button';
import './ProfileContent.css';

interface ProfileContentProps {
  activeTab: ProfileTab;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab }) => {
  return (
    <main className="profile-content">
      {activeTab === 'orders' && (
        <div className="tab-section">
          <h1 className="tab-title">Активные заказы</h1>
          
          <div className="order-card">
            <div className="order-header">
              <div className="order-meta">
                <span className="order-id">Активный заказ 123</span>
                <span className="order-date">31 мая 2026 г.</span>
              </div>
              <span className="order-status">Заказ готовится на кухне</span>
            </div>
            <div className="order-divider"></div>
            <div className="order-items-preview">
              <span className="food-mock">🍔</span>
              <span className="food-mock">🍔</span>
              <span className="food-mock">🍕</span>
            </div>
            <div className="order-divider"></div>
            <div className="order-footer">
              <span className="order-price">Сумма 999 ₽</span>
              <span className="order-delivery">Адрес ул. Антонова, 5, к 18:00</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="tab-section">
          <h1 className="tab-title">История заказов</h1>
          {[1, 2].map((idx) => (
            <div key={idx} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-id">Заказ 123</span>
                  <span className="order-date">31 мая 2026 г.</span>
                </div>
                <span className="order-status">Доставлен</span>
              </div>
              <div className="order-divider"></div>
              <div className="order-items-preview">
                <span className="food-mock">🍔</span>
                <span className="food-mock">🍕</span>
              </div>
              <div className="order-divider"></div>
              <div className="order-footer">
                <span className="order-price">Сумма 999 ₽</span>
                <span className="order-delivery">Адрес ул. Антонова, 5, к 18:00</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'data' && (
        <div className="tab-section">
          <h1 className="tab-title">Личные данные</h1>
          <div className="data-card">
            <div className="input-group">
              <label>Имя</label>
              <input type="text" defaultValue="Илья" />
            </div>
            <div className="input-group">
              <label>Телефон</label>
              <input type="text" defaultValue="+71234567890" />
            </div>
            <div className="input-group">
              <label>Эл. почта</label>
              <input type="email" defaultValue="sok@gmail.com" />
            </div>
            <Button variant="primary" className="save-btn">Сохранить</Button>
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="tab-section address-section">
          <div className="address-card">
            <div className="address-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="address-text">улица имени Ф.А. Блинова, 21</span>
            </div>
            <button className="dots-btn">⋮</button>
          </div>

          <button className="add-address-card">
            <span className="plus-icon">+</span>
            <span>Добавить новый адрес</span>
          </button>
        </div>
      )}
    </main>
  );
};