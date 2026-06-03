import React from 'react';
import './AddressCard.css';

interface AddressCardProps {
  address: { id: number; street_house: string };
  isOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, isOpen, onToggleMenu, onEdit, onDelete }) => {
  return (
    <div className="address-card">
      <div className="address-info">
        {/* SVG Иконка геолокации */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#333333"/>
        </svg>
        <span>{address.street_house}</span>
      </div>
      
      <div className="menu-container">
        <button className="dots-btn" onClick={onToggleMenu}>
          {/* SVG Иконка троеточия */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="5" r="2.5" fill="#333333"/>
            <circle cx="12" cy="12" r="2.5" fill="#333333"/>
            <circle cx="12" cy="19" r="2.5" fill="#333333"/>
          </svg>
        </button>
        {isOpen && (
          <div className="action-menu">
            <button onClick={onEdit}>
              {/* SVG Карандаш */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#333333"/></svg>
              Редактировать
            </button>
            <button className="delete-btn" onClick={onDelete}>
              {/* SVG Корзина */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#D9534F"/></svg>
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};