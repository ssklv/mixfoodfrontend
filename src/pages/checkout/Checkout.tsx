import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/entities/cart/model/cartStore';
import { useDishStore } from '@/entities/dish/model/dishStore';
import { useUserStore } from '@/entities/user/model/userStore';
import './Checkout.css';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { dishes } = useDishStore();
  const { userName } = useUserStore();

  const [formData, setFormData] = useState({
    name: userName || '',
    phone: '',
    address: '',
    time: '',
  });

  // Собираем данные корзины
  const cartDishes = useMemo(() => {
    return items.map(item => {
      const dish = dishes.find(d => d.id === item.id);
      return dish ? { ...dish, quantity: item.quantity } : null;
    }).filter(item => item !== null);
  }, [items, dishes]);

  const total = cartDishes.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Оформляем заказ:', { formData, cartDishes, total });
    // Тут в будущем будет логика отправки на бэк и вызов глобального уведомления
  };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">
        
        {/* Кликабельный логотип */}
        <header className="checkout-logo-header">
          <Link to="/">
            {/* Если есть картинка логотипа, вставь её сюда. Пока сделал текстом в стиле макета */}
            <div className="logo-placeholder">
              <span className="logo-main">МиксФуд</span>
              <span className="logo-sub">От закусок до десертов</span>
            </div>
          </Link>
        </header>

        <form className="checkout-content" onSubmit={handleSubmit}>
          
          {/* ЛЕВАЯ КОЛОНКА: Данные пользователя */}
          <div className="checkout-left-column">
            <h1 className="checkout-title">Оформление заказа</h1>

            <div className="form-section">
              <h3 className="section-subtitle">Получатель</h3>
              <div className="input-row">
                <div className="input-box">
                  <span className="input-label">Имя</span>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Илья" 
                    required 
                  />
                </div>
                <div className="input-box">
                  <span className="input-label">Телефон</span>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7123567890" 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-subtitle">Адрес доставки</h3>
              <div className="input-box address-box">
                {/* SVG Иконка пина */}
                <svg className="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="улица имени Ф.А. Блинова, 21" 
                  required 
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-subtitle">Время доставки</h3>
              <div className="input-box time-box">
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="00:00" 
                />
              </div>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: Состав заказа */}
          <div className="checkout-right-column">
            <h2 className="checkout-title">Состав заказа</h2>
            <div className="summary-divider-top" />

            <div className="summary-items-list">
              {cartDishes.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="summary-item-left">
                    <span className="item-name">{item?.name}</span>
                    {/* Вес пока заглушкой, если в сторе нет weight, выведи что есть */}
                    <span className="item-weight">999 г</span> 
                  </div>
                  <div className="summary-item-right">
                    <span className="item-price">{item?.price}₽</span>
                    <span className="item-quantity">{item?.quantity} шт.</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider-bottom" />

            <div className="summary-total">
              <span>К оплате</span>
              <span className="total-sum">{total}₽</span>
            </div>

            <button type="submit" className="capsule-checkout-btn submit-order">
              Оформить заказ
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};