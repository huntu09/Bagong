"use client"

import { useState, useCallback } from "react"

interface ToastState {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message: string) => showToast(message, "success"), [showToast])
  const showError = useCallback((message: string) => showToast(message, "error"), [showToast])
  const showInfo = useCallback((message: string) => showToast(message, "info"), [showToast])
  const showWarning = useCallback((message: string) => showToast(message, "warning"), [showToast])

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
