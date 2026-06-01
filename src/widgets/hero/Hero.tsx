import './Hero.css';

// Импортируем иконки соцсетей из твоей папки assets
import vkIcon from '../../assets/vk.svg';
import okIcon from '../../assets/ok.svg';
import telegramIcon from '../../assets/telegram.svg';
import dzenIcon from '../../assets/dzen.svg';
import pizza from '../../assets/pizza.svg';

export const Hero = () => {
  return (
    <section className="hero-section">
      {/* Левая текстовая часть */}
      <div className="hero-content">
        <h1 className="hero-title">
          Искусство вкуса
          <span>в каждой детали!</span> {/* Убрали <br />, теперь отступ настраивается в CSS */}
        </h1>
        
        <p className="hero-description">
          Собрали всё: от сытных закусок <br />
          до освежающих напитков <br />
          Вкусно, быстро и всегда вовремя
        </p>
        
        <button className="hero-btn">
          Заказать
        </button>

        {/* Квадратики под соцсети */}
        <div className="hero-socials">
          <a href="https://vk.com" target="_blank" rel="noreferrer" className="social-box" aria-label="Вконтакте">
            <img src={vkIcon} alt="Вконтакте" className="social-icon" />
          </a>
          
          <a href="https://ok.ru" target="_blank" rel="noreferrer" className="social-box" aria-label="Одноклассники">
            <img src={okIcon} alt="Одноклассники" className="social-icon" />
          </a>
          
          <a href="https://t.me" target="_blank" rel="noreferrer" className="social-box" aria-label="Telegram">
            <img src={telegramIcon} alt="Telegram" className="social-icon" />
          </a>
          
          <a href="https://dzen.ru" target="_blank" rel="noreferrer" className="social-box" aria-label="Дзен">
            <img src={dzenIcon} alt="Дзен" className="social-icon" />
          </a>
        </div>
      </div>

      {/* Правая часть под пиццу */}
      <div className="hero-image-container">
        <img src={pizza} className="hero-pizza" />
      </div>
    </section>
  );
};