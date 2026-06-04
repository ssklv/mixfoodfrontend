import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/entities/cart/model/cartStore';
import { useDishStore } from '@/entities/dish/model/dishStore';
import { useUserStore } from '@/entities/user/model/userStore';
import './CartModal.css';

const API_URL = 'http://localhost:8082';

interface CartModalProps {
  onClose: () => void;
  onOpenCheckout: () => void; // Оставляем, чтобы App.tsx не ломался
}

export const CartModal: React.FC<CartModalProps> = ({ onClose, onOpenCheckout }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { dishes } = useDishStore();
  
  const { isAuth, userName } = useUserStore();
  const authorized = isAuth || !!userName;

  const [showToast, setShowToast] = useState(false);

  const cartDishes = items
    .map(item => {
      const dish = dishes.find(d => d.id === item.id);
      return dish ? { ...dish, quantity: item.quantity } : null;
    })
    .filter(item => item !== null);

  const total = cartDishes.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);

  const handleCheckoutClick = () => {
    if (!authorized) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      return;
    }
    
    // Закрываем, вызываем колбэк и переходим
    onClose();
    onOpenCheckout(); 
    navigate('/checkout'); 
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className={`cart-auth-toast ${showToast ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="toast-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </span>
        <div className="toast-text">
          <strong>Вы не авторизованы!</strong>
          <p>Пожалуйста, войдите в аккаунт, чтобы оформить заказ.</p>
        </div>
      </div>

      <div className="cart-container" onClick={e => e.stopPropagation()}>
        {cartDishes.length > 0 ? (
          <>
            <div className="cart-header">
              <h2>Корзина</h2>
              <button className="clear-all-btn" onClick={clearCart}>Очистить</button>
            </div>
            <div className="cart-items-list">
              {cartDishes.map(dish => (
                <div key={dish!.id} className="cart-product-row">
                  <img className="product-round-img" src={`${API_URL}${dish!.imageUrl}`} alt={dish!.name} />
                  <div className="product-middle-info">
                    <h4 className="product-title">{dish!.name}</h4>
                    <div className="product-quantity-pill">
                      <button onClick={() => updateQuantity(dish!.id, dish!.quantity + 1)}>+</button>
                      <span>{dish!.quantity}</span>
                      <button onClick={() => updateQuantity(dish!.id, dish!.quantity - 1)}>-</button>
                    </div>
                  </div>
                  <div className="product-right-info">
                    <button className="delete-cross-btn" onClick={() => removeFromCart(dish!.id)}>×</button>
                    <span className="product-price">{(dish!.price || 0) * (dish!.quantity || 0)}₽</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="footer-total-block">
                <span className="total-label">Сумма заказа</span>
                <span className="total-sum">{total}₽</span>
              </div>
              <button className={`capsule-checkout-btn ${!authorized ? 'btn-disabled' : ''}`} onClick={handleCheckoutClick}>
                Оформить заказ
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart-container"><h3>Пока тут пусто</h3><p>Добавьте что-то в корзину</p></div>
        )}
      </div>
    </div>
  );
};