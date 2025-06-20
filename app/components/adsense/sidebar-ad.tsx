"use client"

import { useEffect } from "react"
import { ADSENSE_CONFIG } from "@/app/lib/adsense-config"

interface SidebarAdProps {
  adSlot?: string
  className?: string
}

export function SidebarAd({ adSlot = ADSENSE_CONFIG.adSlots.sidebarAd, className = "" }: SidebarAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`sidebar-ad ${className}`}>
      <div className="text-center text-xs text-gray-500 mb-2">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </div>
  )
}
