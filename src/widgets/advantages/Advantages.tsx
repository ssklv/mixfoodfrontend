import './Advantages.css';

export const Advantages = () => {
  return (
    <section className="advantages-section">
      {/* Главный заголовок секции */}
      <h2 className="advantages-main-title">Почему выбирают нас?</h2>

      {/* Сетка с тремя преимуществами */}
      <div className="advantages-grid">
        
        {/* Блок 1 */}
        <div className="advantages-item">
          <div className="advantages-img-placeholder">
            {/* 📝 Сюда потом вставишь <img src={...} alt="" /> */}
          </div>
          <h3 className="advantages-item-title">Легко заказать</h3>
          <p className="advantages-item-text">
            Всего пара кликов — и ваша еда уже готовится
          </p>
        </div>

        {/* Блок 2 */}
        <div className="advantages-item">
          <div className="advantages-img-placeholder">
            {/* 📝 Сюда потом вставишь <img src={...} alt="" /> */}
          </div>
          <h3 className="advantages-item-title">Быстрая доставка</h3>
          <p className="advantages-item-text">
            Доставим за 30-45 минут. Следите за статусом заказа в реальном времени в личном кабинете
          </p>
        </div>

        {/* Блок 3 */}
        <div className="advantages-item">
          <div className="advantages-img-placeholder">
            {/* 📝 Сюда потом вставишь <img src={...} alt="" /> */}
          </div>
          <h3 className="advantages-item-title">Качество</h3>
          <p className="advantages-item-text">
            Только свежие продукты от проверенных поставщиков
          </p>
        </div>

      </div>
    </section>
  );
};