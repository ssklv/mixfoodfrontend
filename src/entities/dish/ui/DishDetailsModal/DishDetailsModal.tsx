import React, { useEffect } from 'react';
import { type Dish } from '../../model/dishStore';
import { useCartStore } from '@/entities/cart/model/cartStore'; // Импорт стора корзины
import './DishDetailsModal.css';

interface DishDetailsModalProps {
  dish: Dish;
  onClose: () => void;
}

const API_URL = 'http://localhost:8082'; 

export const DishDetailsModal: React.FC<DishDetailsModalProps> = ({ dish, onClose }) => {
  const { addToCart } = useCartStore(); // Получаем метод добавления

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const formatNumber = (num: number) => {
    return num.toString().replace('.', ',');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left-pane">
          <img src={getImageUrl(dish.imageUrl)} alt={dish.name} className="modal-image" />
        </div>

        <div className="modal-right-pane">
          <button className="modal-close-btn" onClick={onClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#1C1C1C"/>
              <path d="M16 8L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 8L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="modal-info-header">
            <h2 className="modal-title">{dish.name}</h2>
            <span className="modal-meta">
              {dish.volume ? `${dish.volume} мл` : `${dish.weight || 0} г`}
            </span>
          </div>

          <div className="modal-description-wrapper">
            <p className="modal-description">
              {dish.description || 'Описание отсутствует.'}
            </p>
          </div>

          <div className="modal-nutrition-section">
            <h3 className="nutrition-title">Пищевая ценность на 100 г</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-label">Белки</span>
                <span className="nutrition-value">{formatNumber(dish.proteins)} г</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Жиры</span>
                <span className="nutrition-value">{formatNumber(dish.fats)} г</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Углеводы</span>
                <span className="nutrition-value">{formatNumber(dish.carbs)} г</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Калории</span>
                <span className="nutrition-value">{dish.calories} ккал</span>
              </div>
            </div>
          </div>

          <button 
            className="modal-add-btn"
            onClick={() => {
              addToCart(dish.id); // Вызываем логику
              onClose();
            }}
          >
            В корзину за {dish.price}₽
          </button>
        </div>
      </div>
    </div>
  );
};