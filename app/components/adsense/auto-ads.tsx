"use client"

import { useEffect } from "react"

export function AutoAds() {
  useEffect(() => {
    // Cek apakah Auto Ads sudah diinisialisasi
    if (typeof window !== "undefined" && !window.autoAdsInitialized) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-9620623978081909",
          enable_page_level_ads: true,
        })

        // Mark sebagai sudah diinisialisasi
        window.autoAdsInitialized = true

        console.log("Auto Ads initialized successfully")
      } catch (err) {
        console.error("Auto Ads initialization error:", err)
      }
    }
  }, [])

  return null
}

// Extend window interface
declare global {
  interface Window {
    autoAdsInitialized?: boolean
  }
}
