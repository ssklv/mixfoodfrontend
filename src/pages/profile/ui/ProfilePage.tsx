import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, type Address } from '../../../entities/user/model/userStore';
import { useDishStore, type Dish } from '../../../entities/dish/model/dishStore';
import { useOrderStore, type Order } from '../../../entities/order/model/orderStore';
import { AddAddressModal } from '../../../features/address/ui/AddAddressModal/AddAddressModal';
import { DishForm } from '../../../entities/dish/ui/DishForm/DishForm';
import { AddressCard } from '../../../features/address/ui/AddressCard/AddressCard';
import { AdminDishCard } from '../../../entities/dish/ui/AdminDishCard/AdminDishCard';
import { apiClient } from '../../../shared/api/apiClient';
import './ProfilePage.css';

const API_URL = 'http://localhost:8082';

const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

export type ProfileTab = 'orders' | 'history' | 'data' | 'addresses' | 'admin_menu';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userName, userPhone, userEmail, role, logout, fetchProfile,
    updateProfile, isLoading, addresses, fetchAddresses, deleteAddress
  } = useUserStore();

  const { dishes, fetchDishes, deleteDish } = useDishStore();
  const { orders, fetchOrders, fetchAdminOrders, updateOrderStatus, loading: ordersLoading } = useOrderStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
    fetchDishes();
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'history') {
      if (role === 'admin') {
        fetchAdminOrders();
      } else {
        fetchOrders();
      }
    }
  }, [activeTab, role, fetchOrders, fetchAdminOrders]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab, fetchAddresses]);

  useEffect(() => {
    if (activeTab === 'admin_menu' && role === 'admin') {
      fetchDishes();
    }
  }, [activeTab, role, fetchDishes]);

  useEffect(() => {
    setName(userName);
    setPhone(userPhone);
    setEmail(userEmail);
  }, [userName, userPhone, userEmail]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

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

  const getStatusText = (status: string): string => {
    const map: Record<string, string> = {
      new: 'Ожидает подтверждения',
      cooking: 'Готовится на кухне',
      delivering: 'В пути',
      done: 'Доставлен',
      cancelled: 'Отменён',
    };
    return map[status] || status;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const formatFullAddress = (address: Address): string => {
    const parts = [address.street_house];
    if (address.entrance) parts.push(`под. ${address.entrance}`);
    if (address.floor) parts.push(`эт. ${address.floor}`);
    if (address.apartment) parts.push(`кв. ${address.apartment}`);
    if (address.door_code) parts.push(`код ${address.door_code}`);
    return parts.join(', ');
  };

  const getAddressString = (addressId: number): string => {
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) return 'Адрес не указан';
    return formatFullAddress(addr);
  };

  let filteredOrders: Order[] = [];
  if (activeTab === 'orders') {
    if (role === 'admin') {
      filteredOrders = orders;
    } else {
      filteredOrders = orders.filter(o => o.status !== 'done' && o.status !== 'cancelled');
    }
  } else if (activeTab === 'history') {
    filteredOrders = orders.filter(o => o.status === 'done' || o.status === 'cancelled');
  }

  const handleAdminStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      updateOrderStatus(orderId, newStatus);
      alert(`Статус заказа №${orderId} изменён на "${getStatusText(newStatus)}"`);
    } catch (err) {
      console.error(err);
      alert('Ошибка при изменении статуса');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getDishImage = (productId: number): string => {
    const dish = dishes.find(d => d.id === productId);
    return getImageUrl(dish?.imageUrl);
  };

 const renderOrderCard = (order: Order) => {
  const isAdmin = role === 'admin';
  const statusOptions = ['new', 'cooking', 'delivering', 'done', 'cancelled'];
  const orderItems = order.items || [];
  const displayItems = orderItems.slice(0, 3);

  const addressText = !isAdmin ? getAddressString(order.addressId) : '';
  const timeDisplay = order.deliveryTime && order.deliveryTime.trim() !== ''
    ? ` • к ${order.deliveryTime}`
    : ' • время не указано';

  return (
    <div key={order.id} className="order-card-custom">
      <div className="order-card-header">
        <div className="order-meta-left">
          <span className="order-id-label">Заказ №{order.id}</span>
          <span className="order-date-label">{formatDate(order.createdAt)}</span>
        </div>
        {!isAdmin && <span className={`order-status-badge ${order.status}`}>{getStatusText(order.status)}</span>}
      </div>
      <div className="order-divider-custom"></div>
      <div className="order-items-preview-custom">
        {displayItems.length > 0 ? (
          displayItems.map((item, idx) => {
            const imageUrl = getDishImage(item.productId);
            return (
              <div key={idx} className="order-item-icon">
                {imageUrl !== '/placeholder.png' ? (
                  <img 
                    src={imageUrl} 
                    alt="блюдо" 
                    className="order-dish-thumb"
                    onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                  />
                ) : (
                  <div className="placeholder-icon">🍽️</div>
                )}
              </div>
            );
          })
        ) : (
          <span className="more-items">Блюда не указаны</span>
        )}
        {orderItems.length > 3 && <span className="more-items">+{orderItems.length - 3}</span>}
      </div>
      <div className="order-divider-custom"></div>
      <div className="order-card-footer">
        <span className="order-total-price">{order.totalPrice} ₽</span>
        <span className="order-address">
          {!isAdmin && addressText}
          {timeDisplay}
        </span>
      </div>
      {isAdmin && (
        <div className="admin-status-selector">
          <label>Изменить статус:</label>
          <select
            value={order.status}
            onChange={(e) => handleAdminStatusChange(order.id, e.target.value)}
            disabled={updatingOrderId === order.id}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{getStatusText(opt)}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
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
          <button className={`menu-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            {role === 'admin' ? 'История чеков' : 'История'}
          </button>
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

        {(activeTab === 'orders' || activeTab === 'history') && (
          <div className="tab-content-card orders-tab">
            <h2>{activeTab === 'orders' ? (role === 'admin' ? 'Все заказы' : 'Активные заказы') : (role === 'admin' ? 'История чеков' : 'История заказов')}</h2>
            {ordersLoading ? (
              <p>Загрузка заказов...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="empty-orders">Заказов нет</p>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(renderOrderCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin_menu' && role === 'admin' && (
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