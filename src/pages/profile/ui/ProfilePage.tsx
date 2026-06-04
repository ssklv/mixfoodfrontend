import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавили импорт
import { useUserStore } from '../../../entities/user/model/userStore';
import { useDishStore, type Dish } from '../../../entities/dish/model/dishStore'; 
import { AddAddressModal } from '../../../features/address/ui/AddAddressModal/AddAddressModal';
import { DishForm } from '../../../entities/dish/ui/DishForm/DishForm';
import { AddressCard } from '../../../features/address/ui/AddressCard/AddressCard';
import { AdminDishCard } from '../../../entities/dish/ui/AdminDishCard/AdminDishCard'; 
import './ProfilePage.css';
import { type Address } from '../../../entities/user/model/userStore';

export type ProfileTab = 'orders' | 'history' | 'data' | 'addresses' | 'admin_menu';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate(); // Инициализируем хук навигации
  const { 
    userName, userPhone, userEmail, role, logout, fetchProfile, 
    updateProfile, isLoading, addresses, fetchAddresses, deleteAddress 
  } = useUserStore();

  const { dishes, fetchDishes, deleteDish } = useDishStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'data' | 'addresses' | 'admin_menu'>('orders');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false); 
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null); 
  
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // Обработчик выхода
  const handleLogout = () => {
    logout();      // Вызываем логику выхода из стора
    navigate('/'); // Перенаправляем на главную
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
    if (activeTab === 'admin_menu') {
      fetchDishes();
    }
  }, [activeTab, fetchAddresses, fetchDishes]);

  useEffect(() => {
    setName(userName);
    setPhone(userPhone);
    setEmail(userEmail);
  }, [userName, userPhone, userEmail]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null); setPhoneError(null); setEmailError(null); setGlobalError(null); setSuccessMessage(false);

    const result = await updateProfile({ name, phone, email });

    if (result.success) {
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } else {
      const serverError = result.error || '';
      if (serverError.includes('name')) setNameError('Имя не должно быть пустым или длиннее 30 символов');
      else if (serverError.includes('phone')) setPhoneError('Неверный формат телефона (требуется 10 цифр)');
      else if (serverError.includes('email')) setEmailError('Некорректный email или этот адрес уже занят');
      else setGlobalError(serverError || 'Произошла непредвиденная ошибка при сохранении');
    }
  };

  return (
    <div className="profile-page-body">
      <aside className="profile-sidebar">
        <div className="user-info-card">
          <div className="avatar-circle">{userName ? userName.charAt(0).toUpperCase() : 'И'}</div>
          <div className="user-meta">
            <span className="user-name">{userName || 'Илья'}</span>
            <span className="user-phone">{userPhone || '+71234567890'}</span>
          </div>
        </div>
        
        <hr className="sidebar-divider" />

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Заказы</button>
          <button className={`menu-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>История чеков</button>
          
          {role === 'admin' ? (
             <button className={`menu-item ${activeTab === 'admin_menu' ? 'active' : ''}`} onClick={() => setActiveTab('admin_menu')}>Управление меню</button>
          ) : (
            <>
              <button className={`menu-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>Данные</button>
              <button className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>Адреса</button>
            </>
          )}
        </nav>

        <hr className="sidebar-divider" />
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">➔</span> Выйти
        </button>
      </aside>

      <main className="profile-content-area">
        {activeTab === 'data' && (
          <div className="data-form-card">
            <h2>Личные данные</h2>
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className={`profile-input-wrapper ${nameError ? 'input-has-error' : ''}`}>
                <label>Имя</label>
                <input type="text" value={name || ''} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                {nameError && <span className="field-error-text">{nameError}</span>}
              </div>
              <div className={`profile-input-wrapper ${phoneError ? 'input-has-error' : ''}`}>
                <label>Телефон</label>
                <input type="text" value={phone || ''} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
                {phoneError && <span className="field-error-text">{phoneError}</span>}
              </div>
              <div className={`profile-input-wrapper ${emailError ? 'input-has-error' : ''}`}>
                <label>Эл. почта</label>
                <input type="email" value={email || ''} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                {emailError && <span className="field-error-text">{emailError}</span>}
              </div>
              {globalError && <div className="profile-error-message">⚠️ {globalError}</div>}
              {successMessage && <div className="profile-success-message">✓ Данные успешно сохранены</div>}
              <button type="submit" className="save-profile-btn" disabled={isLoading}>{isLoading ? 'Сохранение...' : 'Сохранить'}</button>
            </form>
          </div>
        )}

        {/* ... (остальной JSX без изменений) ... */}
        {activeTab === 'orders' && <div className="tab-content-card"><h2>Активные заказы</h2><p style={{ color: '#7A7A7A' }}>Нет active-ных заказов</p></div>}
        {activeTab === 'history' && <div className="tab-content-card"><h2>История заказов</h2><p style={{ color: '#7A7A7A' }}>История пуста</p></div>}

        {activeTab === 'admin_menu' && (
          <div className="tab-content-card">
            <h2>Управление меню</h2>
            <div className="admin-dishes-list">
              {dishes.map((dish) => (
                <AdminDishCard 
                  key={dish.id} 
                  dish={dish}
                  isOpen={activeMenuId === dish.id}
                  onToggleMenu={() => setActiveMenuId(activeMenuId === dish.id ? null : dish.id)}
                  onEdit={() => {
                    setEditingDish(dish);
                    setIsDishModalOpen(true);
                    setActiveMenuId(null);
                  }}
                  onDelete={() => {
                    if (window.confirm(`Удалить блюдо "${dish.name}"?`)) {
                      deleteDish(dish.id);
                      setActiveMenuId(null);
                    }
                  }}
                />
              ))}
              <button className="add-address-btn" onClick={() => {
                setEditingDish(null);
                setIsDishModalOpen(true);
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Добавить новое блюдо
              </button>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="tab-content-card">
            <h2>Мои адреса</h2>
            <div className="addresses-list">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <AddressCard 
                    key={addr.id} 
                    address={addr}
                    isOpen={activeMenuId === addr.id}
                    onToggleMenu={() => setActiveMenuId(activeMenuId === addr.id ? null : addr.id)}
                    onEdit={() => {
                      setEditingAddress(addr);
                      setIsAddressModalOpen(true);
                      setActiveMenuId(null);
                    }}
                    onDelete={() => {
                      deleteAddress(addr.id);
                      setActiveMenuId(null);
                    }}
                  />
                ))
              ) : (
                <p style={{ color: '#7A7A7A' }}>Адреса не добавлены</p>
              )}
              
              <button className="add-address-btn" onClick={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Добавить новый адрес
              </button>
            </div>
          </div>
        )}
      </main>

      {isAddressModalOpen && (
        <AddAddressModal 
          onClose={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }} 
          addressToEdit={editingAddress} 
        />
      )}

      {isDishModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setIsDishModalOpen(false);
          setEditingDish(null);
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'transparent', padding: 0, border: 'none', width: 'auto' }}>
            <DishForm 
              dishToEdit={editingDish}
              onClose={() => {
                setIsDishModalOpen(false);
                setEditingDish(null);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};