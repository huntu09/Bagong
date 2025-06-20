"use client"

import { useEffect } from "react"
import { ADSENSE_CONFIG } from "@/app/lib/adsense-config"
import { useMobile } from "@/hooks/use-mobile"

interface MobileAdProps {
  adSlot?: string
  className?: string
}

export function MobileAd({ adSlot = ADSENSE_CONFIG.adSlots.mobileAd, className = "" }: MobileAdProps) {
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("AdSense error:", err)
      }
    }
  }, [isMobile])

  if (!isMobile) return null

  return (
    <div className={`mobile-ad my-4 ${className}`}>
      <div className="text-center text-xs text-gray-500 mb-2">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
