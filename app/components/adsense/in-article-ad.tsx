"use client"

import { useEffect } from "react"
import { ADSENSE_CONFIG } from "@/app/lib/adsense-config"

interface InArticleAdProps {
  adSlot?: string
  className?: string
}

export function InArticleAd({ adSlot = ADSENSE_CONFIG.adSlots.inArticleAd, className = "" }: InArticleAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`in-article-ad my-6 ${className}`}>
      <div className="text-center text-xs text-gray-500 mb-2">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        data-ad-slot={adSlot}
        data-ad-layout="in-article"
        data-ad-format="fluid"
      />
    </div>
  )
}
