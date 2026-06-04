import React from 'react';
import { type Dish } from '../../model/dishStore';
import './AdminDishCard.css';

const API_URL = 'http://localhost:8082';

const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

interface AdminDishCardProps {
  dish: Dish;
  isOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AdminDishCard: React.FC<AdminDishCardProps> = ({
  dish,
  isOpen,
  onToggleMenu,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="admin-dish-card">
      <div className="admin-dish-top-row">
        <img
          src={getImageUrl(dish.imageUrl)}
          alt={dish.name}
          className="admin-dish-img"
          onError={(e) => ((e.target as HTMLImageElement).src = '/placeholder.png')}
        />
        <div className="admin-dish-info">
          <div className="admin-dish-header">
            <span className="admin-dish-name">{dish.name}</span>
            <span className="admin-dish-price">{dish.price} ₽</span>
          </div>
          <div className="admin-dish-meta">
            {dish.weight ? <span>{dish.weight} г</span> : null}
            {dish.volume ? <span>{dish.volume} мл</span> : null}
          </div>
        </div>
        <div className="admin-dish-menu-container">
          <button className="admin-dish-dots-btn" onClick={onToggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2.5" fill="#362B2B"/>
              <circle cx="12" cy="12" r="2.5" fill="#362B2B"/>
              <circle cx="12" cy="19" r="2.5" fill="#362B2B"/>
            </svg>
          </button>
          {isOpen && (
            <div className="admin-dish-action-menu">
              <button onClick={onEdit}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#362B2B"/>
                </svg>
                Редактировать
              </button>
              <button className="delete-btn" onClick={onDelete}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#D9534F"/>
                </svg>
                Удалить блюдо
              </button>
            </div>
          )}
        </div>
      </div>
      {dish.description && (
        <div className="admin-dish-description">
          {dish.description}
        </div>
      )}
    </div>
  );
};