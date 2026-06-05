import './Footer.css';
import vkIcon from '../../assets/vk.svg';
import okIcon from '../../assets/ok.svg';
import tgIcon from '../../assets/telegram.svg';
import dzenIcon from '../../assets/dzen.svg'; //

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-column logo-column">
      
        <div className="logo-title">
          <span className="logo-pink">Микс</span>
          <span className="logo-brown">Фуд</span>
        </div>
        <div className="logo-subtitle">От закусок до десертов</div>
        
   
        <div className="footer-socials">
          <button className="social-btn">
            <img src={vkIcon} alt="ВКонтакте" />
          </button>
          <button className="social-btn">
            <img src={okIcon} alt="Одноклассники" />
          </button>
          <button className="social-btn">
            <img src={tgIcon} alt="Telegram" />
          </button>
          <button className="social-btn">
            <img src={dzenIcon} alt="Дополнительно" />
          </button>
        </div>
      </div>

      <div className="footer-column">
        <h3 className="footer-heading">Компания</h3>
        <ul className="footer-links">
          <li>Почему мы?</li>
          <li>О нас</li>
          <li>Стать партнером</li>
        </ul>
      </div>

      <div className="footer-column">
        <h3 className="footer-heading">Поддержка</h3>
        <ul className="footer-links">
          <li>Личный кабинет</li>
          <li>Оставить отзыв</li>
        </ul>
      </div>

      <div className="footer-column newsletter">
        <h3 className="footer-heading">Оставайтесь на связи</h3>
        <p className="footer-text">
          Есть вопросы или пожелания? Мы будем рады вас выслушать
        </p>
        <div className="email-input-wrapper">
          <input type="email" placeholder="Ваш e-mail" />
          <button className="email-submit" type="submit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="16" y2="12"></line>
              <polyline points="11 7 16 12 11 17"></polyline>
              <path d="M 18 6 A 7.5 7.5 0 0 1 18 18"></path>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};