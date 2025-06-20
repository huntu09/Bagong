// AI Writer Pro Service Worker
// Version: 1.0.0

// Dynamic version based on timestamp or build
const VERSION = "1.0.0"
const BUILD_TIME = "2024-01-01" // This should be injected during build
const CACHE_NAME = `ai-writer-pro-v${VERSION}-${BUILD_TIME}`
const STATIC_CACHE = `ai-writer-static-v${VERSION}-${BUILD_TIME}`
const DYNAMIC_CACHE = `ai-writer-dynamic-v${VERSION}-${BUILD_TIME}`

// Files to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
]

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = ["/api/generate", "/api/analytics/metrics", "/api/analytics/actions"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("📦 Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("✅ Static assets cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("❌ Failed to cache static assets:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activating...")

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              // Keep current version caches
              if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName.startsWith("ai-writer-")) {
                console.log("🗑️ Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),

      // Claim all clients
      self.clients.claim(),

      // Notify clients of update
      self.clients
        .matchAll()
        .then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "SW_UPDATED",
              version: VERSION,
              buildTime: BUILD_TIME,
            })
          })
        }),
    ]).then(() => {
      console.log("✅ Service Worker activated successfully")
    }),
  )
})

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request))
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request))
  } else {
    event.respondWith(staleWhileRevalidateStrategy(request))
  }
})

// Enhanced cache-first strategy with better error handling
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Check if cached response is still fresh (optional)
      const cacheDate = cachedResponse.headers.get("date")
      if (cacheDate) {
        const age = Date.now() - new Date(cacheDate).getTime()
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours

        if (age > maxAge) {
          // Cache is stale, try to update in background
          fetch(request)
            .then((response) => {
              if (response.ok) {
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, response.clone())
                })
              }
            })
            .catch(() => {
              // Ignore background update errors
            })
        }
      }

      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error("Cache-first strategy failed:", error)

    // Return a more helpful offline response
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "Konten tidak tersedia offline. Periksa koneksi internet Anda.",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}

// Network-first strategy for API requests
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("Network failed, trying cache:", request.url)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "Tidak ada koneksi internet. Silakan coba lagi nanti.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Navigation strategy for page requests
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.log("Navigation offline, serving cached page")

    // Try to serve cached page
    const cachedResponse = await caches.match("/")
    if (cachedResponse) {
      return cachedResponse
    }

    // Fallback offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>AI Writer Pro - Offline</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              background: #000; 
              color: #fff; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              text-align: center;
            }
            .container { max-width: 400px; padding: 2rem; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { margin-bottom: 1rem; }
            p { opacity: 0.8; line-height: 1.5; }
            button { 
              background: #2563eb; 
              color: white; 
              border: none; 
              padding: 0.75rem 1.5rem; 
              border-radius: 0.5rem; 
              margin-top: 1rem; 
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>AI Writer Pro</h1>
            <p>Anda sedang offline. Beberapa fitur mungkin tidak tersedia sampai koneksi internet kembali.</p>
            <button onclick="window.location.reload()">Coba Lagi</button>
          </div>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url)
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/favicon.ico"
  )
}

function isAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith("/api/") || API_ENDPOINTS.some((endpoint) => url.pathname.startsWith(endpoint))
}

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" || (request.method === "GET" && request.headers.get("accept").includes("text/html"))
  )
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Background sync triggered:", event.tag)

  if (event.tag === "sync-offline-content") {
    event.waitUntil(syncOfflineContent())
  }
})

async function syncOfflineContent() {
  try {
    // Get offline content from IndexedDB or localStorage
    const clients = await self.clients.matchAll()

    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_OFFLINE_CONTENT",
        message: "Syncing offline content...",
      })
    })

    console.log("✅ Offline content synced")
  } catch (error) {
    console.error("❌ Failed to sync offline content:", error)
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("📬 Push notification received")

  const options = {
    body: event.data ? event.data.text() : "Ada update baru di AI Writer Pro!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Buka App",
        icon: "/icons/icon-192x192.png",
      },
      {
        action: "close",
        title: "Tutup",
        icon: "/icons/icon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("AI Writer Pro", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked:", event.action)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Message handling from main thread
self.addEventListener("message", (event) => {
  console.log("💬 Message received:", event.data)

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Error handling
self.addEventListener("error", (event) => {
  console.error("❌ Service Worker error:", event.error)
})

self.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Service Worker unhandled rejection:", event.reason)
})

console.log("🎉 AI Writer Pro Service Worker loaded successfully!")
