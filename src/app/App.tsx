import { useState } from 'react';
import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';
import { Hero } from '@/widgets/hero/Hero';
import { Advantages } from '@/widgets/advantages/Advantages'; 
import { AuthModal } from '@/features/auth/AuthModal';
import ellipseImg from '@/assets/ellipse.svg'; 

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="app-container">
      <img src={ellipseImg} className="ellipse" alt="" />
      <div className="content-wrapper">
        <Header onOpenAuth={handleOpenAuth} />
        <main>
           <Hero />
           <Advantages /> 
        </main>
      </div>
      <Footer />
      
      {isAuthOpen && (
        <AuthModal 
          initialMode={authMode} 
          onClose={() => setIsAuthOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;