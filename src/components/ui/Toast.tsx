'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-[1000]',
        'px-7 py-3.5 rounded-xl font-semibold text-[14px]',
        'shadow-heavy backdrop-blur-sm',
        'animate-fade-in',
        'max-w-[90%] text-center',
        type === 'success' && 'bg-green-500/95 text-white border-l-4 border-green-600',
        type === 'error' && 'bg-red-500/95 text-white border-l-4 border-red-600',
        type === 'warning' && 'bg-orange-500/95 text-white border-l-4 border-orange-600',
        type === 'info' && 'bg-blue-500/95 text-white border-l-4 border-blue-600'
      )}
    >
      {message}
    </div>
  );
}

// Toast Provider/Manager (optional, for multiple toasts)
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastProps['type'] }>>([]);

  const showToast = (message: string, type: ToastProps['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
}