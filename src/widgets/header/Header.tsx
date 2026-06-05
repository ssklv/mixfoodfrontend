import { useState, useMemo } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { useUserStore } from '@/entities/user/model/userStore';
import { useDishStore } from '@/entities/dish/model/dishStore';
import { useCartStore } from '@/entities/cart/model/cartStore';
import { Link } from 'react-router-dom';
import './Header.css';


const API_URL = 'http://localhost:8082';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenDishDetails: (dish: any) => void;
  onOpenCart: () => void; 
}

export const Header = ({ onOpenAuth, onOpenProfile, onOpenDishDetails, onOpenCart }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAuth = useUserStore((state) => state.isAuth);
  const userName = useUserStore((state) => state.userName);
  const dishes = useDishStore((state) => state.dishes);

  
  const cartItems = useCartStore((state) => state.items);

  
  const { totalQuantity, totalPrice } = useMemo(() => {
    let quantity = 0;
    let price = 0;

    cartItems.forEach((item) => {
      quantity += item.quantity;
      const dishData = dishes.find((d) => d.id === item.id);
      if (dishData) {
        price += dishData.price * item.quantity;
      }
    });

    return { totalQuantity: quantity, totalPrice: price };
  }, [cartItems, dishes]);

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };


  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return dishes.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, dishes]);

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <div className="logo-title">МиксФуд</div>
            <div className="logo-subtitle">От закусок до десертов</div>
          </div>
        </Link>
      </div>

      <div className="header-search">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          type="text" 
          placeholder="Искать блюда" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
    
        {searchQuery.trim() && (
          <div className="search-results-dropdown">
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <div 
                  key={dish.id} 
                  className="search-result-item" 
                  onClick={() => {
                    onOpenDishDetails(dish);
                    setSearchQuery('');
                  }}
                >
                  <img src={getImageUrl(dish.imageUrl)} alt={dish.name} />
                  <span>{dish.name}</span>
                </div>
              ))
            ) : (
              <div className="no-results">Ничего не найдено</div>
            )}
          </div>
        )}

        <button className="clear-search" onClick={() => setSearchQuery('')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="header-actions">
        {isAuth ? (
          <Button 
            variant="default" 
            onClick={onOpenProfile} 
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          >
            {userName || 'Пользователь'}
          </Button>
        ) : (
          <>
            <Button onClick={() => onOpenAuth('register')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>Регистрация</Button>
            <Button onClick={() => onOpenAuth('login')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}>Вход</Button>
          </>
        )}

        <button className="header-cart-capsule" onClick={onOpenCart}>
          {totalQuantity > 0 ? (
      
            <>
              <span className="cart-capsule-price">{totalPrice}₽</span>
              <div className="cart-capsule-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#362B2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="cart-capsule-count">{totalQuantity}</span>
            </>
          ) : (

            <>
              <div className="cart-capsule-icon-wrapper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#362B2B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="cart-capsule-text">Корзина</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};