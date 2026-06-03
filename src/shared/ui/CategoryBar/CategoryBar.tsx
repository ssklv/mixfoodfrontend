import React from 'react';
import './CategoryBar.css';

const categories = ['Пицца', 'Бургеры', 'Закуски', 'Салаты', 'Десерты', 'Напитки'];

interface CategoryBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button 
          key={cat} 
          className={`category-item ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};