"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePWA } from "../lib/pwa-utils"
import { CloseIcon, SparklesIcon } from "../icons"

export function PWAInstallBanner() {
  const { isInstallAvailable, isInstalled, installApp } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  // Don't show if dismissed, already installed, or not available
  if (isDismissed || isInstalled || !isInstallAvailable) {
    return null
  }

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const success = await installApp()
      if (success) {
        setIsDismissed(true)
      }
    } catch (error) {
      console.error("Install failed:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-2xl animate-slide-up md:left-auto md:right-4 md:max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <SparklesIcon size="md" className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-sm">Install AI Writer Pro</h3>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                PWA
              </Badge>
            </div>

            <p className="text-white/90 text-xs mb-3 leading-relaxed">
              Install aplikasi untuk akses cepat, notifikasi, dan penggunaan offline!
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-xs px-3 py-1.5 h-auto"
              >
                {isInstalling ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Installing...
                  </div>
                ) : (
                  "Install App"
                )}
              </Button>

              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 text-xs px-2 py-1.5 h-auto"
              >
                Nanti
              </Button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Tutup banner install"
          >
            <CloseIcon size="sm" />
          </button>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </Card>
  )
}
