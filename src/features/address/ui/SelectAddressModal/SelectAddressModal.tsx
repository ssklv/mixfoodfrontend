import React, { useEffect, useState } from 'react';
import { useUserStore, type Address } from '@/entities/user/model/userStore';
import { AddAddressModal } from '../AddAddressModal/AddAddressModal';
import './SelectAddressModal.css';

interface SelectAddressModalProps {
  onClose: () => void;
  onSelect: (address: Address) => void;
  currentAddressId?: number;
}

export const SelectAddressModal: React.FC<SelectAddressModalProps> = ({
  onClose,
  onSelect,
  currentAddressId,
}) => {
  const { addresses, fetchAddresses } = useUserStore();

  const [selectedId, setSelectedId] = useState<number | null>(
    currentAddressId ?? null
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = () => {
    const address = addresses.find((a) => a.id === selectedId);

    if (!address) {
      alert('Выберите адрес доставки');
      return;
    }

    onSelect(address);
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div
        className="address-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="address-modal-close-btn"
          onClick={onClose}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="address-modal-title">
          Адреса доставки
        </h2>

        <div className="address-modal-list">
          {addresses.length > 0 ? (
            addresses.map((addr) => {
              const parts = [addr.street_house];

              if (addr.entrance)
                parts.push(`под. ${addr.entrance}`);

              if (addr.floor)
                parts.push(`эт. ${addr.floor}`);

              if (addr.apartment)
                parts.push(`кв. ${addr.apartment}`);

              const fullAddress = parts.join(', ');

              return (
                <div
                  key={addr.id}
                  className={`address-modal-item ${
                    selectedId === addr.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedId(addr.id)}
                >
                  {fullAddress}
                </div>
              );
            })
          ) : (
            <p className="no-addresses-text">
              У вас нет сохранённых адресов.
            </p>
          )}
        </div>

        <button
          type="button"
          className="address-modal-add-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="add-icon">+</span>
          Добавить новый адрес
        </button>

        <button
          type="button"
          className="address-modal-submit-btn"
          onClick={handleSave}
        >
          Сохранить
        </button>
      </div>

      {isAddModalOpen && (
        <AddAddressModal
          addressToEdit={null}
          onClose={() => {
            setIsAddModalOpen(false);
            fetchAddresses();
          }}
        />
      )}
    </div>
  );
};