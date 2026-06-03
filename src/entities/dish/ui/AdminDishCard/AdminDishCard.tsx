import React from 'react';
import { type Dish } from '../../model/dishStore'; // Импортируем правильный тип

interface AdminDishCardProps {
  dish: Dish; // Применяем Dish, где weight и volume могут отсутствовать по очереди
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
  onDelete
}) => {
  return (
    <div className="admin-dish-item">
      <div className="admin-dish-main-info" onClick={onToggleMenu}>
        <div className="admin-dish-details">
          <span className="admin-dish-title">{dish.name}</span>
          <span className="admin-dish-price">{dish.price} ₽</span>
          <span className="admin-dish-meta">
            {dish.weight ? `${dish.weight} г` : ''}
            {dish.volume ? `${dish.volume} мл` : ''}
          </span>
        </div>
        <button className={`admin-menu-dots-btn ${isOpen ? 'active' : ''}`}>
          •••
        </button>
      </div>

      {isOpen && (
        <div className="admin-dish-dropdown-menu">
          <button className="admin-dropdown-action-btn edit-btn" onClick={onEdit}>
            ✏️ Редактировать
          </button>
          <button className="admin-dropdown-action-btn delete-btn" onClick={onDelete}>
            🗑️ Удалить блюдо
          </button>
        </div>
      )}
    </div>
  );
};