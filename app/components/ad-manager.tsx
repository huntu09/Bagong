"use client"

import { useEffect, useState } from "react"
import { InArticleAd } from "./adsense/in-article-ad"
import { SidebarAd } from "./adsense/sidebar-ad"
import { FooterAd } from "./adsense/footer-ad"
import { MobileAd } from "./adsense/mobile-ad"
import { ADSENSE_CONFIG } from "@/app/lib/adsense-config"
import { useMobile } from "@/hooks/use-mobile"

interface AdManagerProps {
  contentLength?: number
  showSidebar?: boolean
  showFooter?: boolean
  showMobile?: boolean
}

export function AdManager({
  contentLength = 0,
  showSidebar = true,
  showFooter = true,
  showMobile = true,
}: AdManagerProps) {
  const isMobile = useMobile()
  const [inArticleAdsCount, setInArticleAdsCount] = useState(0)

  useEffect(() => {
    // Calculate how many in-article ads to show based on content length
    // Rule of thumb: 1 ad per 500 characters, max 3 ads
    const adsCount = Math.min(Math.floor(contentLength / 500), 3)
    setInArticleAdsCount(adsCount)
  }, [contentLength])

  return (
    <>
      {/* In-article ads */}
      {Array.from({ length: inArticleAdsCount }).map((_, index) => (
        <InArticleAd key={`in-article-${index}`} adSlot={ADSENSE_CONFIG.adSlots.inArticleAd} className="my-8" />
      ))}

      {/* Sidebar ad for desktop */}
      {showSidebar && !isMobile && <SidebarAd adSlot={ADSENSE_CONFIG.adSlots.sidebarAd} className="my-4" />}

      {/* Footer ad */}
      {showFooter && <FooterAd adSlot={ADSENSE_CONFIG.adSlots.footerBanner} className="mt-8 mb-4" />}

      {/* Mobile-specific ad */}
      {showMobile && isMobile && <MobileAd adSlot={ADSENSE_CONFIG.adSlots.mobileAd} className="my-4" />}
    </>
  )
}
