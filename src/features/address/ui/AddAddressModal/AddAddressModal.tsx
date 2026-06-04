import React, { useEffect, useState } from 'react';
import { useUserStore, type Address } from '@/entities/user/model/userStore';
import './AddAddressModal.css';

interface AddAddressModalProps {
  onClose: () => void;
  addressToEdit: Address | null;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  onClose,
  addressToEdit,
}) => {
  const { createAddress, updateAddress } = useUserStore();

  const [formData, setFormData] = useState({
    street_house: '',
    entrance: '',
    floor: '',
    apartment: '',
    door_code: '',
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        street_house: addressToEdit.street_house || '',
        entrance: addressToEdit.entrance || '',
        floor: addressToEdit.floor || '',
        apartment: addressToEdit.apartment || '',
        door_code: addressToEdit.door_code || '',
      });
    } else {
      setFormData({
        street_house: '',
        entrance: '',
        floor: '',
        apartment: '',
        door_code: '',
      });
    }
  }, [addressToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.street_house.trim()) {
      alert('Пожалуйста, введите улицу и дом');
      return;
    }

    let res;
    if (addressToEdit) {
      res = await updateAddress(addressToEdit.id, formData);
    } else {
      res = await createAddress(formData);
    }
    
    if (res.success) {
      onClose();
    } else {
      alert(res.error || 'Не удалось сохранить адрес');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Кнопка закрытия крестиком */}
        <button type="button" className="close-x-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-body">
          {/* ЛЕВАЯ КОЛОНКА (ФОРМА) */}
          <div className="form-column">
            <h2>{addressToEdit ? 'Редактировать адрес' : 'Новый адрес'}</h2>
            
            <form className="address-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Улица, дом" 
                value={formData.street_house}
                onChange={(e) => setFormData({...formData, street_house: e.target.value})}
                required
              />

              <div className="grid-row">
                <input 
                  type="text" 
                  placeholder="Квартира" 
                  value={formData.apartment}
                  onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Подъезд" 
                  value={formData.entrance}
                  onChange={(e) => setFormData({...formData, entrance: e.target.value})}
                />
              </div>

              <div className="grid-row">
                <input 
                  type="text" 
                  placeholder="Этаж" 
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Код на двери" 
                  value={formData.door_code}
                  onChange={(e) => setFormData({...formData, door_code: e.target.value})}
                />
              </div>

              <button type="submit" className="add-submit-btn">
                {addressToEdit ? 'Сохранить' : 'Добавить'}
              </button>
            </form>
          </div>

          {/* ПРАВАЯ КОЛОНКА (КАРТА ЯНДЕКС) */}
          <div className="map-column" style={{ background: '#EADBC8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Сюда можно вставить твой компонент карты <YandexMap /> */}
            <span style={{ color: '#8C7A6B', fontSize: '18px' }}>Карта загружается...</span>
          </div>
        </div>

      </div>
    </div>
  );
};