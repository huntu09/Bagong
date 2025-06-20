"use client"

import { useCallback } from "react"
import Toast from "react-native-toast-message"

export const useToast = () => {
  const showSuccess = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "success",
      text1: title || "Sukses",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    })
  }, [])

  const showError = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "error",
      text1: title || "Error",
      text2: message,
      position: "top",
      visibilityTime: 4000,
    })
  }, [])

  const showWarning = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "info",
      text1: title || "Peringatan",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    })
  }, [])

  const showInfo = useCallback((message: string, title?: string) => {
    Toast.show({
      type: "info",
      text1: title || "Info",
      text2: message,
      position: "top",
      visibilityTime: 3000,
    })
  }, [])

  const hideToast = useCallback(() => {
    Toast.hide()
  }, [])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  }
}
