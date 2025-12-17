import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false,
    registration: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Workers not supported');
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    // Register service worker
    registerServiceWorker();

    // Check for updates every 60 seconds
    const updateInterval = setInterval(() => {
      checkForUpdates();
    }, 60000);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log('📦 Registering service worker...');

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service worker registered:', registration.scope);

      setState(prev => ({
        ...prev,
        isRegistered: true,
        registration,
      }));

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (!newWorker) return;

        setState(prev => ({ ...prev, isUpdating: true }));

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            console.log('🆕 New version available!');
            setState(prev => ({
              ...prev,
              hasUpdate: true,
              isUpdating: false,
            }));
          }
        });
      });

      // Check for updates immediately
      registration.update().catch(err => {
        console.warn('Update check failed:', err);
      });

    } catch (error) {
      console.error('❌ Service worker registration failed:', error);
    }
  };

  const checkForUpdates = async () => {
    if (!state.registration) return;

    try {
      await state.registration.update();
    } catch (error) {
      console.warn('Update check failed:', error);
    }
  };

  const applyUpdate = () => {
    if (!state.registration || !state.registration.waiting) return;

    // Tell the waiting service worker to activate
    state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page to activate new service worker
    window.location.reload();
  };

  const unregister = async () => {
    if (!state.registration) return;

    try {
      const success = await state.registration.unregister();
      if (success) {
        console.log('✅ Service worker unregistered');
        setState({
          isSupported: true,
          isRegistered: false,
          isUpdating: false,
          hasUpdate: false,
          registration: null,
        });
      }
    } catch (error) {
      console.error('❌ Failed to unregister service worker:', error);
    }
  };

  return {
    ...state,
    applyUpdate,
    unregister,
    checkForUpdates,
  };
}