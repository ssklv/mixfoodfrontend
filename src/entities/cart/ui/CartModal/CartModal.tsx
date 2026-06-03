import React, { useState } from 'react';
import { useCartStore } from '@/entities/cart/model/cartStore';
import { useDishStore } from '@/entities/dish/model/dishStore';
import { useUserStore } from '@/entities/user/model/userStore'; // 🔒 Импортируем стор пользователя
import './CartModal.css';

const API_URL = 'http://localhost:8082';

interface CartModalProps {
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ onClose, onOpenCheckout }) => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { dishes } = useDishStore();
  
  // Достаем данные авторизации (проверяем по флагу isAuth или наличию имени userName)
  const { isAuth, userName } = useUserStore();
  const authorized = isAuth || !!userName;

  // Состояние для анимации появления уведомления
  const [showToast, setShowToast] = useState(false);

  // Сопоставляем ID из корзины с данными о блюдах
  const cartDishes = items
    .map(item => {
      const dish = dishes.find(d => d.id === item.id);
      return dish ? { ...dish, quantity: item.quantity } : null;
    })
    .filter(item => item !== null);

  const total = cartDishes.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);

  // Логика клика по кнопке «Оформить заказ»
  const handleCheckoutClick = () => {
    if (!authorized) {
      // Если не авторизован — включаем уведомление на 4 секунды
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return;
    }
    
    // Если авторизован — открываем окно оформления заказа
    onOpenCheckout();
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      
      {/* 🔔 ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ (показывается, если showToast === true) */}
      <div className={`cart-auth-toast ${showToast ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
        {/* 👇 Заменили эмодзи на стильный SVG-замок */}
        <span className="toast-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        
        <div className="toast-text">
          <strong>Вы не авторизованы!</strong>
          <p>Пожалуйста, войдите в аккаунт, чтобы оформить заказ.</p>
        </div>
      </div>

      <div className="cart-container" onClick={e => e.stopPropagation()}>
        
        {cartDishes.length > 0 ? (
          <>
            {/* Верхняя панель: Заголовок и Очистить */}
            <div className="cart-header">
              <h2>Корзина</h2>
              <button className="clear-all-btn" onClick={clearCart}>Очистить</button>
            </div>

            {/* Список товаров */}
            <div className="cart-items-list">
              {cartDishes.map(dish => {
                // Вычисляем итоговую стоимость за конкретную позицию
                const itemTotal = (dish!.price || 0) * (dish!.quantity || 0);
                
                return (
                  <div key={dish!.id} className="cart-product-row">
                    <img 
                      className="product-round-img" 
                      src={`${API_URL}${dish!.imageUrl}`} 
                      alt={dish!.name} 
                    />
                    
                    <div className="product-middle-info">
                      <h4 className="product-title">{dish!.name}</h4>
                      {/* Переключатель количества */}
                      <div className="product-quantity-pill">
                        <button onClick={() => updateQuantity(dish!.id, dish!.quantity + 1)}>+</button>
                        <span>{dish!.quantity}</span>
                        <button onClick={() => updateQuantity(dish!.id, dish!.quantity - 1)}>-</button>
                      </div>
                    </div>

                    <div className="product-right-info">
                      <button className="delete-cross-btn" onClick={() => removeFromCart(dish!.id)}>
                        ×
                      </button>
                      {/* Выводим рассчитанную сумму за количество данного товара */}
                      <span className="product-price">{itemTotal}₽</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Нижняя панель: Сумма и Оформить заказ */}
            <div className="cart-footer">
              <div className="footer-total-block">
                <span className="total-label">Сумма заказа</span>
                <span className="total-sum">{total}₽</span>
              </div>
              
              {/* Меняем onClick на наш обработчик и динамически добавляем класс btn-disabled */}
              <button 
                className={`capsule-checkout-btn ${!authorized ? 'btn-disabled' : ''}`} 
                onClick={handleCheckoutClick}
              >
                Оформить заказ
              </button>
            </div>
          </>
        ) : (
          /* Пустое состояние */
          <div className="empty-cart-container">
            <h3>Пока тут пусто</h3>
            <p>Добавьте что-то в корзину</p>
          </div>
        )}
        
      </div>
    </div>
  );
};