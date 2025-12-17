'use client';

import { useServiceWorker } from '@/lib/hooks/useServiceWorker';
import { cn } from '@/lib/utils/cn';
import { useState, useEffect } from 'react';

export function UpdateNotification() {
  const { hasUpdate, applyUpdate } = useServiceWorker();

  if (!hasUpdate) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[460px]">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-heavy p-4 animate-slide-down">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-2xl">🆕</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base mb-1">Update Available!</h4>
            <p className="text-sm text-white/90">
              New version with improvements
            </p>
          </div>

          {/* Update Button */}
          <button
            onClick={applyUpdate}
            className="px-4 py-2 bg-white text-green-600 hover:bg-gray-100 rounded-lg font-bold transition-colors shadow-lg flex-shrink-0"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFFLINE INDICATOR
// ==========================================
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[460px]">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-heavy p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-2xl">📡</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-base mb-1">You're Offline</h4>
            <p className="text-sm text-white/90">
              Showing cached data. Connect to get latest updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}