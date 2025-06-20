"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useOnboardingContext } from "./onboarding-provider"

export function OnboardingTrigger() {
  const { shouldShowOnboarding, startOnboarding, resetOnboarding } = useOnboardingContext()

  // Auto-start onboarding for new users
  useEffect(() => {
    if (shouldShowOnboarding) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        startOnboarding()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [shouldShowOnboarding, startOnboarding])

  // Development helper - remove in production
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <>
      {/* Development Controls */}
      {isDevelopment && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          <Button onClick={startOnboarding} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Onboarding
          </Button>
          <Button onClick={resetOnboarding} size="sm" variant="outline" className="block w-full">
            Reset Onboarding
          </Button>
        </div>
      )}
    </>
  )
}
