"use client"

import { useEffect, useState } from "react"
import { ADSENSE_CONFIG } from "@/app/lib/adsense-config"

export function AdSenseManager() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAdSense = async () => {
      // Pastikan hanya dijalankan sekali dan hanya di browser
      if (isInitialized || typeof window === "undefined") return

      try {
        // Tunggu sampai script AdSense dimuat
        const checkAdSenseLoaded = () => {
          return new Promise<void>((resolve) => {
            const checkInterval = setInterval(() => {
              // @ts-ignore
              if (window.adsbygoogle) {
                clearInterval(checkInterval)
                resolve()
              }
            }, 100)

            // Timeout setelah 10 detik
            setTimeout(() => {
              clearInterval(checkInterval)
              resolve()
            }, 10000)
          })
        }

        await checkAdSenseLoaded()

        // Cek apakah Auto Ads sudah pernah diinisialisasi secara global
        if (ADSENSE_CONFIG.autoAds.enabled && !window.autoAdsInitialized) {
          // @ts-ignore
          ;(window.adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: ADSENSE_CONFIG.publisherId,
            enable_page_level_ads: ADSENSE_CONFIG.autoAds.pageLevel,
          })

          // Mark sebagai sudah diinisialisasi secara global
          window.autoAdsInitialized = true
          console.log("✅ AdSense Auto Ads initialized")
        } else if (window.autoAdsInitialized) {
          console.log("ℹ️ AdSense Auto Ads already initialized, skipping")
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("❌ AdSense initialization error:", error)
      }
    }

    initializeAdSense()
  }, []) // Empty dependency array - run only once

  return null
}

// Extend window interface
declare global {
  interface Window {
    autoAdsInitialized?: boolean
    adsbygoogle?: any[]
  }
}
