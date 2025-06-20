export const ADSENSE_CONFIG = {
  publisherId: "ca-pub-9620623978081909",
  adSlots: {
    headerBanner: "1438306767",
    sidebar: "3167748455",
    inArticle: "6691226347",
    footerBanner: "8776893274",
    mobile: "1089974949",
  },
  autoAds: {
    enabled: true,
    pageLevel: true,
    // Prevent duplicate initialization
    initialized: false,
  },
  settings: {
    lazyLoad: true,
    errorTracking: true,
    performanceOptimized: true,
  },
} as const

export type AdSlotType = keyof typeof ADSENSE_CONFIG.adSlots
