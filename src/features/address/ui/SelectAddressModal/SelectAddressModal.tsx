import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/user/model/userStore';
import { AddAddressModal } from '../AddAddressModal/AddAddressModal'; 
import './SelectAddressModal.css';

interface SelectAddressModalProps {
  onClose: () => void;
  onSelect: (address: string) => void;
  currentAddress: string | null;
}

export const SelectAddressModal: React.FC<SelectAddressModalProps> = ({
  onClose,
  onSelect,
  currentAddress,
}) => {
  const { addresses, fetchAddresses } = useUserStore();
  const [localSelected, setLocalSelected] = useState<string | null>(currentAddress);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSave = () => {
    if (localSelected) {
      onSelect(localSelected);
    } else {
      alert('Пожалуйста, выберите один из адресов');
    }
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="address-modal-close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="address-modal-title">Адреса доставки</h2>

        <div className="address-modal-list">
          {addresses.length > 0 ? (
            addresses.map((addr) => {
              const addressParts = [addr.street_house];
              if (addr.entrance) addressParts.push(`под. ${addr.entrance}`);
              if (addr.floor) addressParts.push(`эт. ${addr.floor}`);
              if (addr.apartment) addressParts.push(`кв. ${addr.apartment}`);
              
              const fullAddressStr = addressParts.join(', ');
              const isSelected = localSelected === fullAddressStr;

              return (
                <div
                  key={addr.id}
                  className={`address-modal-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setLocalSelected(fullAddressStr)}
                >
                  {fullAddressStr}
                </div>
              );
            })
          ) : (
            <p className="no-addresses-text">У вас нет сохраненных адресов. Добавьте первый!</p>
          )}
        </div>

        <button 
          type="button"
          className="address-modal-add-btn" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="add-icon">+</span> Добавить новый адрес
        </button>

        <button type="button" className="address-modal-submit-btn" onClick={handleSave}>
          Сохранить
        </button>
      </div>

      {isAddModalOpen && (
        <AddAddressModal 
          onClose={() => {
            setIsAddModalOpen(false);
            fetchAddresses(); // Обновляем список, чтобы новый адрес сразу появился
          }} 
          addressToEdit={null}
        />
      )}
    </div>
  );
};