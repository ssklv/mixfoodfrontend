import { useState } from 'react';
import { Button } from '../Button/Button'; 
import './SearchInput.css';

export const SearchInput = () => {
  const [value, setValue] = useState('');

  return (
    <div className="search-wrapper">
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Поиск блюд..." 
      />
      
      {value && (
        <Button 
          className="search-clear-btn" 
          onClick={() => setValue('')}
        >
          ✕
        </Button>
      )}
    </div>
  );
};