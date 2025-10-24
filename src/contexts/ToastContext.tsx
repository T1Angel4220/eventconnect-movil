import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast, { ToastType } from '@/src/components/Toast';

interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = Date.now().toString();
    console.log('🍞 Mostrando toast:', { id, message, type, duration });
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    console.log('🗑️ Cerrando toast:', id);
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => showToast(message, 'success', duration), [showToast]);
  const showError = useCallback((message: string, duration?: number) => showToast(message, 'error', duration), [showToast]);
  const showWarning = useCallback((message: string, duration?: number) => showToast(message, 'warning', duration), [showToast]);
  const showInfo = useCallback((message: string, duration?: number) => showToast(message, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
          duration={toast.duration}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

