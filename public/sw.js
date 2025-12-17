// Service Worker for TITIK SPORTS PWA
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `titik-sports-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html', // Fallback page
];

// API endpoints to cache
const API_CACHE = 'titik-sports-api-v1';
const IMAGE_CACHE = 'titik-sports-images-v1';

// ==========================================
// INSTALL EVENT - Cache static assets
// ==========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// ==========================================
// ACTIVATE EVENT - Clean old caches
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// ==========================================
// FETCH EVENT - Network strategies
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: API calls - Network First, Cache Fallback
  if (url.hostname === 'www.fotmob.com' && url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Strategy 2: Images - Cache First, Network Fallback
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Strategy 3: HTML/JS/CSS - Stale While Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAME));
    return;
  }
});

// ==========================================
// CACHING STRATEGIES
// ==========================================

/**
 * Network First - Try network, fallback to cache
 * Best for: API calls that need fresh data
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, update cache
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed, using cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache, return offline page or error
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'No internet connection' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Cache First - Try cache, fallback to network
 * Best for: Images and static assets
 */
async function cacheFirstStrategy(request, cacheName) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Cache miss, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new resource
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed and no cache
    console.error('[SW] Fetch failed:', request.url);
    return new Response('', { status: 404 });
  }
}

/**
 * Stale While Revalidate - Return cache immediately, update in background
 * Best for: HTML, CSS, JS files
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse); // Fallback to cache if network fails
  
  // Return cache immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// ==========================================
// BACKGROUND SYNC - Update matches
// ==========================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-matches') {
    event.waitUntil(syncMatches());
  }
});

async function syncMatches() {
  console.log('[SW] Syncing matches in background...');
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const response = await fetch(
      `https://www.fotmob.com/api/matches?date=${today}&timezone=Asia/Bangkok&ccode3=IDN`
    );
    
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      await cache.put(
        `https://www.fotmob.com/api/matches?date=${today}`,
        response
      );
      console.log('[SW] Matches synced successfully');
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'TITIK SPORTS',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// ==========================================
// MESSAGE HANDLER - Communication with app
// ==========================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');