import React, { useEffect } from 'react';
import { useToastStore } from '@/shared/lib/toastStore';
import './Toast.css';

export const GlobalToast: React.FC = () => {
  const { toast, hideToast } = useToastStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(hideToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className="global-toast">
      <span className="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </span>
      <div className="toast-text">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
    </div>
  );
};