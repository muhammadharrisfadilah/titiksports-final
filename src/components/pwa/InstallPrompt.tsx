'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show prompt after 30 seconds (not too annoying)
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('✅ PWA installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User ${outcome} the install prompt`);
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    // Clear the prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if installed or dismissed recently
  if (isInstalled) return null;
  
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 7 * 24 * 60 * 60 * 1000) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[460px]">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-heavy p-5 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <div className="text-3xl">⚽</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-lg mb-1">Install TITIK SPORTS</h3>
            <p className="text-sm text-white/90">
              Get faster access & offline support
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-5 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-lg">⚡</span>
            <span>Lightning fast loading</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-lg">📱</span>
            <span>Works like a native app</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-lg">🔔</span>
            <span>Get match notifications</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-lg">📡</span>
            <span>Works offline</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur-sm"
          >
            Maybe Later
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-3 px-4 bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-bold transition-colors shadow-lg"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INSTALL BUTTON (untuk manual install)
// ==========================================
export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!canInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold',
        'hover:bg-primary-dark transition-colors shadow-md'
      )}
    >
      <span className="text-lg">📱</span>
      <span>Install App</span>
    </button>
  );
}