"use client"

// PWA Utilities for managing service worker and app installation

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

class PWAManager {
  private static instance: PWAManager
  private deferredPrompt: BeforeInstallPromptEvent | null = null
  private isInstalled = false
  private swRegistration: ServiceWorkerRegistration | null = null

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  async init(): Promise<void> {
    if (typeof window === "undefined") return

    // Check if app is already installed
    this.checkInstallStatus()

    // Register service worker
    await this.registerServiceWorker()

    // Setup install prompt
    this.setupInstallPrompt()

    // Setup app update detection
    this.setupUpdateDetection()

    // Setup offline/online detection
    this.setupNetworkDetection()

    console.log("🎉 PWA Manager initialized")
  }

  private checkInstallStatus(): void {
    // Check if running as PWA
    this.isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    console.log("📱 PWA Install Status:", this.isInstalled ? "Installed" : "Not Installed")
  }

  private async registerServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        console.log("✅ Service Worker registered:", this.swRegistration.scope)

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener("message", this.handleSWMessage.bind(this))

        // Check for updates
        this.swRegistration.addEventListener("updatefound", () => {
          console.log("🔄 Service Worker update found")
          this.handleServiceWorkerUpdate()
        })
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error)
      }
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      console.log("📲 Install prompt available")
      e.preventDefault()
      this.deferredPrompt = e as BeforeInstallPromptEvent

      // Dispatch custom event to notify app
      window.dispatchEvent(new CustomEvent("pwa-install-available"))
    })

    window.addEventListener("appinstalled", () => {
      console.log("🎉 PWA installed successfully")
      this.isInstalled = true
      this.deferredPrompt = null

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("pwa-installed"))
    })
  }

  private setupUpdateDetection(): void {
    if (!this.swRegistration) return

    this.swRegistration.addEventListener("updatefound", () => {
      const newWorker = this.swRegistration!.installing

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("🔄 New version available")
            window.dispatchEvent(new CustomEvent("pwa-update-available"))
          }
        })
      }
    })
  }

  private setupNetworkDetection(): void {
    window.addEventListener("online", () => {
      console.log("🌐 Back online")
      window.dispatchEvent(new CustomEvent("pwa-online"))
    })

    window.addEventListener("offline", () => {
      console.log("📴 Gone offline")
      window.dispatchEvent(new CustomEvent("pwa-offline"))
    })
  }

  private handleSWMessage(event: MessageEvent): void {
    console.log("💬 Message from SW:", event.data)

    if (event.data.type === "SYNC_OFFLINE_CONTENT") {
      window.dispatchEvent(
        new CustomEvent("pwa-sync-content", {
          detail: event.data.message,
        }),
      )
    }
  }

  private handleServiceWorkerUpdate(): void {
    const newWorker = this.swRegistration?.installing

    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          // New version is available
          window.dispatchEvent(new CustomEvent("pwa-update-ready"))
        }
      })
    }
  }

  // Public methods

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log("❌ Install prompt not available")
      return false
    }

    try {
      await this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice

      console.log("📲 Install prompt result:", outcome)

      this.deferredPrompt = null
      return outcome === "accepted"
    } catch (error) {
      console.error("❌ Install prompt failed:", error)
      return false
    }
  }

  isInstallAvailable(): boolean {
    return !!this.deferredPrompt
  }

  isAppInstalled(): boolean {
    return this.isInstalled
  }

  async updateServiceWorker(): Promise<void> {
    if (!this.swRegistration) return

    try {
      await this.swRegistration.update()

      // Tell the new service worker to skip waiting
      if (this.swRegistration.waiting) {
        this.swRegistration.waiting.postMessage({ type: "SKIP_WAITING" })
      }

      // Reload the page to activate new version
      window.location.reload()
    } catch (error) {
      console.error("❌ Service Worker update failed:", error)
    }
  }

  async getServiceWorkerVersion(): Promise<string> {
    if (!navigator.serviceWorker.controller) return "No SW"

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || "Unknown")
      }

      navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [messageChannel.port2])
    })
  }

  isOnline(): boolean {
    return navigator.onLine
  }

  // Background sync for offline actions
  async scheduleBackgroundSync(tag: string): Promise<void> {
    if (!this.swRegistration || !("sync" in window.ServiceWorkerRegistration.prototype)) {
      console.log("❌ Background Sync not supported")
      return
    }

    try {
      await this.swRegistration.sync.register(tag)
      console.log("✅ Background sync scheduled:", tag)
    } catch (error) {
      console.error("❌ Background sync failed:", error)
    }
  }

  // Push notifications
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.log("❌ Notifications not supported")
      return "denied"
    }

    const permission = await Notification.requestPermission()
    console.log("🔔 Notification permission:", permission)
    return permission
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swRegistration || !("PushManager" in window)) {
      console.log("❌ Push notifications not supported")
      return null
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      console.log("❌ VAPID public key not configured")
      return null
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      })

      console.log("✅ Push subscription created")
      return subscription
    } catch (error) {
      console.error("❌ Push subscription failed:", error)
      return null
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

export const pwaManager = PWAManager.getInstance()

// React hook for PWA functionality
export function usePWA() {
  const [isInstallAvailable, setIsInstallAvailable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Initialize PWA
    pwaManager.init()

    // Set initial states
    setIsInstalled(pwaManager.isAppInstalled())
    setIsOnline(pwaManager.isOnline())

    // Event listeners
    const handleInstallAvailable = () => setIsInstallAvailable(true)
    const handleInstalled = () => {
      setIsInstalled(true)
      setIsInstallAvailable(false)
    }
    const handleUpdateAvailable = () => setIsUpdateAvailable(true)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("pwa-install-available", handleInstallAvailable)
    window.addEventListener("pwa-installed", handleInstalled)
    window.addEventListener("pwa-update-available", handleUpdateAvailable)
    window.addEventListener("pwa-online", handleOnline)
    window.addEventListener("pwa-offline", handleOffline)

    return () => {
      window.removeEventListener("pwa-install-available", handleInstallAvailable)
      window.removeEventListener("pwa-installed", handleInstalled)
      window.removeEventListener("pwa-update-available", handleUpdateAvailable)
      window.removeEventListener("pwa-online", handleOnline)
      window.removeEventListener("pwa-offline", handleOffline)
    }
  }, [])

  const installApp = async () => {
    const success = await pwaManager.showInstallPrompt()
    if (success) {
      setIsInstallAvailable(false)
    }
    return success
  }

  const updateApp = async () => {
    await pwaManager.updateServiceWorker()
    setIsUpdateAvailable(false)
  }

  return {
    isInstallAvailable,
    isInstalled,
    isUpdateAvailable,
    isOnline,
    installApp,
    updateApp,
    pwaManager,
  }
}

// Import useState and useEffect
import { useState, useEffect } from "react"
