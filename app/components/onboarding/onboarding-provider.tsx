"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useOnboarding, type OnboardingState } from "@/app/hooks/use-onboarding"

interface OnboardingContextType extends OnboardingState {
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  shouldShowOnboarding: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const onboarding = useOnboarding()

  return <OnboardingContext.Provider value={onboarding}>{children}</OnboardingContext.Provider>
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboardingContext must be used within an OnboardingProvider")
  }
  return context
}
