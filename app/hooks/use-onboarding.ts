"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<OnboardingStepProps>
  canSkip?: boolean
  autoAdvance?: boolean
  duration?: number
}

export interface OnboardingStepProps {
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onComplete: () => void
  currentStep: number
  totalSteps: number
  isActive: boolean
}

export interface OnboardingState {
  isActive: boolean
  currentStep: number
  isCompleted: boolean
  hasSeenOnboarding: boolean
}

const ONBOARDING_STORAGE_KEY = "ai-writer-onboarding-state"

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isActive: false,
    currentStep: 0,
    isCompleted: false,
    hasSeenOnboarding: false,
  })

  // Load onboarding state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY)
      if (saved) {
        const parsedState = JSON.parse(saved)
        setState((prev) => ({
          ...prev,
          hasSeenOnboarding: parsedState.hasSeenOnboarding || false,
          isCompleted: parsedState.isCompleted || false,
        }))
      }
    } catch (error) {
      console.error("Error loading onboarding state:", error)
    }
  }, [])

  // Save state to localStorage
  const saveState = useCallback(
    (newState: Partial<OnboardingState>) => {
      try {
        const updatedState = { ...state, ...newState }
        setState(updatedState)
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify({
            hasSeenOnboarding: updatedState.hasSeenOnboarding,
            isCompleted: updatedState.isCompleted,
          }),
        )
      } catch (error) {
        console.error("Error saving onboarding state:", error)
      }
    },
    [state],
  )

  const startOnboarding = useCallback(() => {
    saveState({
      isActive: true,
      currentStep: 0,
      hasSeenOnboarding: true,
    })
  }, [saveState])

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }))
  }, [])

  const skipOnboarding = useCallback(() => {
    saveState({
      isActive: false,
      isCompleted: true,
      hasSeenOnboarding: true,
    })
  }, [saveState])

  const completeOnboarding = useCallback(() => {
    saveState({
      isActive: false,
      isCompleted: true,
      hasSeenOnboarding: true,
    })
  }, [saveState])

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY)
      setState({
        isActive: false,
        currentStep: 0,
        isCompleted: false,
        hasSeenOnboarding: false,
      })
    } catch (error) {
      console.error("Error resetting onboarding:", error)
    }
  }, [])

  const shouldShowOnboarding = !state.hasSeenOnboarding && !state.isCompleted

  return {
    ...state,
    startOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
    shouldShowOnboarding,
  }
}
