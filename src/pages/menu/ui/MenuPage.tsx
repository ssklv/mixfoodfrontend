import React, { useState, useEffect } from 'react';
import { useDishStore, type Dish } from '../../../entities/dish/model/dishStore';
import { DishCard } from '../../../entities/dish/ui/DishCard/DishCard';
import { DishDetailsModal } from '../../../entities/dish/ui/DishDetailsModal/DishDetailsModal';
import './MenuPage.css';

const CATEGORIES = [
  { id: 1, name: 'Пицца' },
  { id: 2, name: 'Бургеры' },
  { id: 3, name: 'Закуски' },
  { id: 4, name: 'Салаты' },
  { id: 5, name: 'Десерты' },
  { id: 6, name: 'Напитки' },
];

export const MenuPage: React.FC = () => {
  const { dishes, fetchDishes, isLoading } = useDishStore();
  
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  if (isLoading) return <div className="menu-loading">Загрузка блюд...</div>;

  return (
    <div className="menu-page-wrapper">
      {CATEGORIES.map((category) => {
        const categoryDishes = dishes.filter((d) => d.categoryId === category.id);
        if (categoryDishes.length === 0) return null;

        return (
          <section 
            key={category.id} 
            id={`category-${category.id}`} 
            className="menu-category-section"
          >
            <h2 className="category-title">{category.name}</h2>
            
            <div className="dishes-grid">
              {categoryDishes.map((dish) => (
                <DishCard 
                  key={dish.id} 
                  dish={dish} 
                  onOpenDetails={(dish) => setSelectedDish(dish)} 
                />
              ))}
            </div>
          </section>
        );
      })}

      {selectedDish && (
        <DishDetailsModal 
          dish={selectedDish} 
          onClose={() => setSelectedDish(null)} 
        />
      )}
    </div>
  );
};