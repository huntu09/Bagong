"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { StatusBar, LogBox } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { Provider as PaperProvider } from "react-native-paper"
import Toast from "react-native-toast-message"
import SplashScreen from "react-native-splash-screen"

import { AppNavigator } from "./src/navigation/AppNavigator"
import { OnboardingScreen } from "./src/screens/OnboardingScreen"
import { storageService } from "./src/services/storageService"
import { COLORS } from "./src/constants"

// Ignore specific warnings
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "VirtualizedLists should never be nested",
])

const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    disabled: COLORS.textMuted,
    placeholder: COLORS.textSecondary,
    backdrop: COLORS.overlay,
    onSurface: COLORS.text,
    notification: COLORS.primary,
  },
  dark: true,
}

const App: React.FC = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Check onboarding status
      const onboardingCompleted = await storageService.isOnboardingCompleted()
      setIsOnboardingCompleted(onboardingCompleted)

      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsReady(true)
        SplashScreen.hide()
      }, 1000)
    } catch (error) {
      console.error("Error initializing app:", error)
      setIsOnboardingCompleted(false)
      setIsReady(true)
      SplashScreen.hide()
    }
  }

  const handleOnboardingComplete = async () => {
    await storageService.setOnboardingCompleted()
    setIsOnboardingCompleted(true)
  }

  if (!isReady || isOnboardingCompleted === null) {
    return null
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} translucent={false} />

        {isOnboardingCompleted ? <AppNavigator /> : <OnboardingScreen onComplete={handleOnboardingComplete} />}

        <Toast />
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
