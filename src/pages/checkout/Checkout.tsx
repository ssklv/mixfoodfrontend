import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCartStore } from '@/entities/cart/model/cartStore';
import { useDishStore, type Dish } from '@/entities/dish/model/dishStore';
import { useUserStore, type Address } from '@/entities/user/model/userStore';
import { useOrderStore } from '@/entities/order/model/orderStore';

import { SelectAddressModal } from '@/features/address/ui/SelectAddressModal/SelectAddressModal';

import './Checkout.css';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const { items, clearCart } = useCartStore();
  const { dishes } = useDishStore();
  const { userName, userPhone } = useUserStore();
  const { createOrder } = useOrderStore();

  const [formData, setFormData] = useState({
    time: '',
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const cartDishes = useMemo(() => {
    return items
      .map((item) => {
        const dish = dishes.find((d) => d.id === item.id);
        return dish
          ? {
              ...dish,
              quantity: item.quantity,
            }
          : null;
      })
      .filter(
        (item): item is Dish & { quantity: number } =>
          item !== null
      );
  }, [items, dishes]);

  const total = useMemo(() => {
    return cartDishes.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartDishes]);

  const formatFullAddress = (address: Address): string => {
    const parts = [address.street_house];
    if (address.entrance) parts.push(`под. ${address.entrance}`);
    if (address.floor) parts.push(`эт. ${address.floor}`);
    if (address.apartment) parts.push(`кв. ${address.apartment}`);
    if (address.door_code) parts.push(`код ${address.door_code}`);
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert('Пожалуйста, выберите адрес доставки');
      return;
    }

    if (!formData.time) {
      alert('Пожалуйста, укажите время доставки');
      return;
    }

    if (cartDishes.length === 0) {
      alert('Корзина пуста');
      return;
    }

    const orderPayload = {
      addressId: selectedAddress.id,
      deliveryTime: formData.time,
      items: cartDishes.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: total,
    };

    setSubmitting(true);
    const success = await createOrder(orderPayload);
    setSubmitting(false);

    if (success) {
      clearCart();
      alert('Заказ успешно создан!');
      navigate('/profile');
    } else {
      alert('Ошибка при создании заказа. Попробуйте позже.');
    }
  };

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">
        <form
          className="checkout-content"
          onSubmit={handleSubmit}
        >
          <div className="checkout-left-column">
            <h1 className="checkout-title">
              Оформление заказа
            </h1>

            <div className="form-section">
              <h3 className="section-subtitle">
                Получатель
              </h3>

              <div className="input-row">
                <div className="input-box">
                  <span className="input-label">Имя</span>
                  <input
                    type="text"
                    value={userName || ''}
                    readOnly
                    className="read-only-input"
                  />
                </div>

                <div className="input-box">
                  <span className="input-label">Телефон</span>
                  <input
                    type="text"
                    value={userPhone || ''}
                    readOnly
                    className="read-only-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-subtitle">
                Адрес доставки
              </h3>

              {selectedAddress ? (
                <div
                  className="selected-address-box"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  <span className="selected-address-text">
                    {formatFullAddress(selectedAddress)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="select-address-btn"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  Выберите адрес доставки
                </button>
              )}
            </div>

            <div className="form-section">
              <h3 className="section-subtitle">
                Время доставки
              </h3>

              <div className="input-box time-box">
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9:]/g, '');
                    if (value.length === 2 && !value.includes(':')) {
                      value += ':';
                    }
                    if (value.length <= 5) {
                      setFormData({ ...formData, time: value });
                    }
                  }}
                  placeholder="12:30"
                  maxLength={5}
                  required
                />
              </div>
            </div>
          </div>

          <div className="checkout-right-column">
            <h2 className="checkout-title">
              Состав заказа
            </h2>

            <div className="summary-divider-top" />

            <div className="summary-items-list">
              {cartDishes.length > 0 ? (
                cartDishes.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-left">
                      <span className="item-name">{item.name}</span>
                      <span className="item-weight">
                        {item.weight ? `${item.weight} г` : (item.volume ? `${item.volume} мл` : '')}
                      </span>
                    </div>
                    <div className="summary-item-right">
                      <span className="item-price">{item.price}₽</span>
                      <span className="item-quantity">{item.quantity} шт.</span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '20px 0', color: '#7A7A7A' }}>
                  Корзина пуста
                </p>
              )}
            </div>

            <div className="summary-divider-bottom" />

            <div className="summary-total">
              <span>К оплате</span>
              <span className="total-sum">{total}₽</span>
            </div>

            <button
              type="submit"
              className="capsule-checkout-btn submit-order"
              disabled={submitting}
            >
              {submitting ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </form>
      </div>

      {isAddressModalOpen && (
        <SelectAddressModal
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={(address) => {
            setSelectedAddress(address);
            setIsAddressModalOpen(false);
          }}
          currentAddressId={selectedAddress?.id}
        />
      )}
    </div>
  );
};