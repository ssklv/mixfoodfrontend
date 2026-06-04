import React, { useState, useRef, useEffect } from 'react';
import { useDishStore, type Dish } from '../../model/dishStore';
import './DishForm.css';

const API_URL = 'http://localhost:8082';

const getImageUrl = (url: string | undefined | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

interface DishFormProps {
  dishToEdit?: Dish | null;
  onClose?: () => void;
}

const CATEGORIES = [
  { id: 1, name: 'Пицца' },
  { id: 2, name: 'Бургеры' },
  { id: 3, name: 'Закуски' },
  { id: 4, name: 'Салаты' },
  { id: 5, name: 'Десерты' },
  { id: 6, name: 'Напитки' },
];

export const DishForm: React.FC<DishFormProps> = ({ dishToEdit, onClose }) => {
  const { fetchDishes } = useDishStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    proteins: '',
    fats: '',
    carbs: '',
    calories: '',
    weight: '',
    volume: '',
    categoryId: 1
  });

  const isDrink = Number(formData.categoryId) === 6;

  useEffect(() => {
    if (dishToEdit) {
      setPreview(getImageUrl(dishToEdit.imageUrl));
      setFormData({
        name: dishToEdit.name || '',
        price: String(dishToEdit.price || ''),
        description: dishToEdit.description || '',
        proteins: String(dishToEdit.proteins || '0'),
        fats: String(dishToEdit.fats || '0'),
        carbs: String(dishToEdit.carbs || '0'),
        calories: String(dishToEdit.calories || '0'),
        weight: String(dishToEdit.weight || ''),
        volume: String(dishToEdit.volume || ''),
        categoryId: dishToEdit.categoryId || 1
      });
    } else {
      setPreview(null);
      setImage(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        proteins: '',
        fats: '',
        carbs: '',
        calories: '',
        weight: '',
        volume: '',
        categoryId: 1
      });
    }
  }, [dishToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.name || !formData.price) {
        alert("Заполните название и цену!");
        return;
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('accessToken') || '';
      const headers: HeadersInit = { 'Authorization': `Bearer ${token}` };

      let imageUrl = dishToEdit ? dishToEdit.imageUrl : '';
      if (image) {
        const imageForm = new FormData();
        imageForm.append('image', image);
        const uploadRes = await fetch('/api/menu/upload', { method: 'POST', headers, body: imageForm });
        if (!uploadRes.ok) throw new Error('Ошибка загрузки картинки');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        categoryId: formData.categoryId,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        calories: Number(formData.calories || 0),
        imageUrl: imageUrl,
        weight: isDrink ? null : Number(formData.weight || 0),
        volume: isDrink ? Number(formData.volume || 0) : null,
        proteins: isDrink ? 0 : Number(formData.proteins || 0),
        fats: isDrink ? 0 : Number(formData.fats || 0),
        carbs: isDrink ? 0 : Number(formData.carbs || 0),
      };

      const isEdit = !!dishToEdit;
      const res = await fetch(isEdit ? `/api/menu/${dishToEdit.id}` : '/api/menu', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Ошибка сохранения на сервере');
      
      await fetchDishes();
      if (onClose) onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dish-modal-wrapper">
      <div className="dish-image-section" onClick={() => fileInputRef.current?.click()}>
        {preview ? <img src={preview} alt="Блюдо" /> : <div className="image-placeholder-text">Выберите фото</div>}
        <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
      </div>

      <div className="dish-form-section">
        <div className="dish-top-row">
          <input type="text" name="name" placeholder="Название блюда" className="dish-input" value={formData.name} onChange={handleChange} />
          {onClose && <button className="dish-close-btn" onClick={onClose}>✕</button>}
        </div>

        <div className="dish-row">
          <select name="categoryId" className="dish-input" value={formData.categoryId} onChange={handleChange}>
            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <input type="number" name="price" placeholder="Цена, ₽" className="dish-input" value={formData.price} onChange={handleChange} />
        </div>

        <textarea name="description" placeholder="Описание блюда..." className="dish-input dish-textarea" value={formData.description} onChange={handleChange} />

        <div className="dish-nut-label">Пищевая ценность на 100 г</div>

        {!isDrink && (
          <div className="dish-row">
            <input type="number" name="proteins" placeholder="Белки, г" className="dish-input" value={formData.proteins} onChange={handleChange} />
            <input type="number" name="fats" placeholder="Жиры, г" className="dish-input" value={formData.fats} onChange={handleChange} />
            <input type="number" name="carbs" placeholder="Угл., г" className="dish-input" value={formData.carbs} onChange={handleChange} />
          </div>
        )}

        <div className="dish-row">
          <input type="number" name="calories" placeholder="Калории, ккал" className="dish-input" value={formData.calories} onChange={handleChange} />
          {isDrink ? (
            <input type="number" name="volume" placeholder="Объем, мл" className="dish-input" value={formData.volume} onChange={handleChange} />
          ) : (
            <input type="number" name="weight" placeholder="Вес, г" className="dish-input" value={formData.weight} onChange={handleChange} />
          )}
        </div>

        <button className="dish-save-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? '...' : dishToEdit ? 'Сохранить изменения' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};