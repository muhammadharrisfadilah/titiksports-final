'use client';

import { useEffect } from 'react';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdateNotification, OfflineIndicator } from '@/components/pwa/UpdateNotification';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Every 60 seconds
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }

    // Prevent default install prompt (we'll show custom one)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
    });

    // Log when app is installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      
      // Track install (optional analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'engagement',
          event_label: 'PWA Installation',
        });
      }
    });

    // Handle app launch
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('🚀 App launched in standalone mode');
    }
  }, []);

  return (
    <>
      {children}
      
      {/* PWA Components */}
      <InstallPrompt />
      <UpdateNotification />
      <OfflineIndicator />
    </>
  );
}