import { useState } from 'react';
import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';
import { Hero } from '@/widgets/hero/Hero';
import { Advantages } from '@/widgets/advantages/Advantages'; 
import { CategoryBar } from '@/shared/ui/CategoryBar/CategoryBar';
import { AuthModal } from '@/features/auth/AuthModal';
import { ProfilePage } from '@/pages/profile/ui/ProfilePage';
import { MenuPage } from '@/pages/menu/ui/MenuPage';
import { DishDetailsModal } from '@/entities/dish/ui/DishDetailsModal/DishDetailsModal';
import { CartModal } from '@/entities/cart/ui/CartModal/CartModal'; // Импорт корзины
import { useUserStore } from '@/entities/user/model/userStore'; 
import ellipseImg from '@/assets/ellipse.svg'; 

const CATEGORY_MAP: Record<string, number> = {
  'Пицца': 1,
  'Бургеры': 2,
  'Закуски': 3,
  'Салаты': 4,
  'Десерты': 5,
  'Напитки': 6,
};

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Состояние корзины
  const [currentPage, setCurrentPage] = useState<'main' | 'profile'>('main'); 
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('Пицца'); 

  const isAuth = useUserStore((state) => state.isAuth);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  if (!isAuth && currentPage === 'profile') {
    setCurrentPage('main');
  }

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    const categoryId = CATEGORY_MAP[categoryName];
    if (categoryId) {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className={`app-container ${currentPage === 'profile' ? 'profile-mode' : ''}`}>
      
      {currentPage === 'main' && <img src={ellipseImg} className="ellipse" alt="" />}
      
      <div className="content-wrapper">
        <Header 
          onOpenAuth={handleOpenAuth} 
          onOpenProfile={() => setCurrentPage('profile')} 
          onOpenDishDetails={(dish) => setSelectedDish(dish)}
          onOpenCart={() => setIsCartOpen(true)} // Передаем функцию открытия
        />
        
        <main>
          {currentPage === 'main' ? (
            <>
              <Hero />
              <Advantages /> 
              
              <CategoryBar 
                activeCategory={activeCategory} 
                onSelectCategory={handleCategorySelect}
              />
              
              <MenuPage />
            </>
          ) : (
            <ProfilePage /> 
          )}
        </main>
      </div>
      
      <Footer />
      
      {/* Модальные окна */}
      {isAuthOpen && (
        <AuthModal 
          initialMode={authMode} 
          onClose={() => setIsAuthOpen(false)} 
        />
      )}

      {selectedDish && (
        <DishDetailsModal 
          dish={selectedDish} 
          onClose={() => setSelectedDish(null)} 
        />
      )}

      {/* Отрисовка корзины */}
      {isCartOpen && (
        <CartModal 
          onClose={() => setIsCartOpen(false)} 
          onOpenCheckout={() => {
            setIsCartOpen(false);
            // Тут потом добавим логику открытия формы оформления заказа
          }} 
        />
      )}
    </div>
  );
}

export default App;