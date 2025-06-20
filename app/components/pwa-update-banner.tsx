"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePWA } from "../lib/pwa-utils"
import { SparklesIcon } from "../icons"

export function PWAUpdateBanner() {
  const { isUpdateAvailable, updateApp } = usePWA()

  if (!isUpdateAvailable) {
    return null
  }

  const handleUpdate = async () => {
    await updateApp()
  }

  return (
    <Card className="fixed top-20 left-4 right-4 z-50 bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl animate-slide-down md:left-auto md:right-4 md:max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <SparklesIcon size="md" className="text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm mb-1">Update Tersedia!</h3>
            <p className="text-white/90 text-xs mb-3">
              Versi baru AI Writer Pro sudah tersedia dengan fitur dan perbaikan terbaru.
            </p>

            <Button
              onClick={handleUpdate}
              size="sm"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold text-xs"
            >
              Update Sekarang
            </Button>
          </div>
        </div>
      </CardContent>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </Card>
  )
}
