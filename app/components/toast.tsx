"use client"

import { useEffect } from "react"
import { CheckIcon, AlertIcon, InfoIcon, WarningIcon } from "../icons"

interface ToastProps {
  message: string
  type: "success" | "error" | "info" | "warning"
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600"
      case "error":
        return "bg-red-500 text-white border-red-600"
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600"
      case "info":
      default:
        return "bg-blue-500 text-white border-blue-600"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon size="sm" />
      case "error":
        return <AlertIcon size="sm" />
      case "warning":
        return <WarningIcon size="sm" />
      case "info":
      default:
        return <InfoIcon size="sm" />
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 sm:px-6 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in-right border-l-4 max-w-sm ${getToastStyles()}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <span className="text-sm sm:text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Tutup notifikasi"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
