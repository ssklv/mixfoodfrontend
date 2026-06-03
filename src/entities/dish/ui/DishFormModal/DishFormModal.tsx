import { DishForm } from '../../../../entities/dish/ui/DishForm/DishForm';
import './DishFormModal.css'; // Просто скопируй стили из AddAddressModal или создай пустой

export const DishFormModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <DishForm />
      </div>
    </div>
  );
};