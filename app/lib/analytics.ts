// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "GA_MEASUREMENT_ID", {
      page_title: title || document.title,
      page_location: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track AI content generation
export const trackContentGeneration = (templateType: string, contentLength: number) => {
  trackEvent("generate_content", "AI_Generation", templateType, contentLength)
}

// Track user interactions
export const trackUserInteraction = (element: string, action: string) => {
  trackEvent(action, "User_Interaction", element)
}

// Track PWA install
export const trackPWAInstall = () => {
  trackEvent("install", "PWA", "app_install")
}

// Track errors
export const trackError = (error: string, location: string) => {
  trackEvent("error", "JavaScript_Error", `${location}: ${error}`)
}
