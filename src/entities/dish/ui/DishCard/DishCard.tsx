import React from 'react';
import { type Dish } from '../../model/dishStore';
import { useCartStore } from '@/entities/cart/model/cartStore'; // Импорт стора корзины
import './DishCard.css';

interface DishCardProps {
  dish: Dish;
  onOpenDetails?: (dish: Dish) => void;
}

const API_URL = 'http://localhost:8082';

export const DishCard: React.FC<DishCardProps> = ({ dish, onOpenDetails }) => {
  const { addToCart } = useCartStore(); // Получаем метод добавления

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  return (
    <div className="dish-showcase-card" onClick={() => onOpenDetails?.(dish)}>
      <div className="dish-showcase-image-wrapper">
        <img 
          src={getImageUrl(dish.imageUrl)} 
          alt={dish.name} 
          loading="lazy" 
        />
      </div>
      
      <div className="dish-showcase-info">
        <h3 className="dish-showcase-title">{dish.name}</h3>
        
        <span className="dish-showcase-meta">
          {dish.weight ? `${dish.weight} г` : ''}
          {dish.volume ? `${dish.volume} мл` : ''}
        </span>
        
        <div className="dish-showcase-footer">
          <span className="dish-showcase-price">{dish.price} ₽</span>
          <button 
            className="dish-showcase-add-btn" 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(dish.id); // Вызываем логику
            }}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};