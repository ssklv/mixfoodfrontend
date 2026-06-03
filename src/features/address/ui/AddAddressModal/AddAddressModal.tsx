import React, { useState } from 'react';
import { YMaps, Map } from '@pbe/react-yandex-maps';
import { useUserStore } from '../../../../entities/user/model/userStore';
import type { Address } from '../../../../entities/user/model/userStore';
import './AddAddressModal.css';

interface AddAddressModalProps {
  onClose: () => void;
  addressToEdit?: Address | null;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ onClose, addressToEdit }) => {
  const { createAddress, updateAddress } = useUserStore();
  
  const [formData, setFormData] = useState(addressToEdit || {
    street_house: '', apartment: '', entrance: '', floor: '', door_code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = addressToEdit 
      ? await updateAddress(addressToEdit.id, formData)
      : await createAddress(formData);

    if (result.success) {
      onClose();
    } else {
      alert(result.error || 'Произошла ошибка при сохранении');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-x-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#222222"/><path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        
        <div className="modal-body">
          <div className="form-column">
            <h2>{addressToEdit ? 'Редактировать адрес' : 'Новый адрес'}</h2>
            <form className="address-form" onSubmit={handleSubmit}>
              <input placeholder="Улица, дом" value={formData.street_house} onChange={e => setFormData({...formData, street_house: e.target.value})} />
              <div className="grid-row">
                <input placeholder="Квартира" value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} />
                <input placeholder="Подъезд" value={formData.entrance} onChange={e => setFormData({...formData, entrance: e.target.value})} />
              </div>
              <div className="grid-row">
                <input placeholder="Этаж" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
                <input placeholder="Код" value={formData.door_code} onChange={e => setFormData({...formData, door_code: e.target.value})} />
              </div>
              <button type="submit" className="add-submit-btn">Сохранить</button>
            </form>
          </div>
          <div className="map-column">
            <YMaps><Map defaultState={{ center: [55.75, 37.57], zoom: 12 }} width="100%" height="100%" /></YMaps>
          </div>
        </div>
      </div>
    </div>
  );
};