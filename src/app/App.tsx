import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';
import { Hero } from '@/widgets/hero/Hero';
import { Advantages } from '@/widgets/advantages/Advantages'; 
import { CategoryBar } from '@/shared/ui/CategoryBar/CategoryBar';
import { AuthModal } from '@/features/auth/AuthModal';
import { ProfilePage } from '@/pages/profile/ui/ProfilePage';
import { MenuPage } from '@/pages/menu/ui/MenuPage';
import { Checkout } from '@/pages/checkout/Checkout';
import { DishDetailsModal } from '@/entities/dish/ui/DishDetailsModal/DishDetailsModal';
import { CartModal } from '@/entities/cart/ui/CartModal/CartModal'; 
import { useUserStore } from '@/entities/user/model/userStore'; 
import { GlobalToast } from '@/shared/ui/Toast/Toast';
import { connectOrderSocket, closeOrderSocket } from '@/shared/lib/websocket';
import ellipseImg from '@/assets/ellipse.svg'; 

const CATEGORY_MAP: Record<string, number> = {
  'Пицца': 1, 'Бургеры': 2, 'Закуски': 3, 'Салаты': 4, 'Десерты': 5, 'Напитки': 6,
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'profile'>('main'); 


  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('Пицца'); 





  
  const { isAuth } = useUserStore();

  const isProfile = location.pathname === '/profile';
  const isCheckout = location.pathname === '/checkout';

  useEffect(() => {
    if (isAuth) {
      connectOrderSocket();
    } else {
      closeOrderSocket();
    }
  }, [isAuth]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    const categoryId = CATEGORY_MAP[categoryName];
    if (categoryId) {
      document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`app-container ${isProfile ? 'profile-mode' : ''} ${isCheckout ? 'checkout-mode' : ''}`}>
      {location.pathname === '/' && <img src={ellipseImg} className="ellipse" alt="" />}
      
      <div className="content-wrapper">
        <Header 
          onOpenAuth={handleOpenAuth} 
          onOpenProfile={() => { setCurrentPage('profile'); navigate('/profile'); }} 
          onOpenDishDetails={(dish) => setSelectedDish(dish)}
          onOpenCart={() => setIsCartOpen(true)}
        />
        
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Advantages /> 
                <CategoryBar activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
                <MenuPage />
              </>
            } />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
      
      <Footer />
      
      {isAuthOpen && <AuthModal initialMode={authMode} onClose={() => setIsAuthOpen(false)} />}
      {selectedDish && <DishDetailsModal dish={selectedDish} onClose={() => setSelectedDish(null)} />}
      
      {isCartOpen && (
        <CartModal 
          onClose={() => setIsCartOpen(false)} 
          onOpenCheckout={() => { setIsCartOpen(false); navigate('/checkout'); }} 
        />
      )}
      
      <GlobalToast />
    </div>
  );
}

export default App;