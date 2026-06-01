import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary';
  icon?: ReactNode;
  onClick?: () => void; // Явно добавили onClick в интерфейс
}

export const Button = ({ children, variant = 'default', icon, className = '', onClick, ...props }: ButtonProps) => {
  return (
    <button 
      className={`shared-btn variant-${variant} ${className}`} 
      onClick={onClick} // Явно передаем сюда
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};