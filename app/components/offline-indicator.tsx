"use client"

import { Card, CardContent } from "@/components/ui/card"
import { usePWA } from "../lib/pwa-utils"
import { AlertIcon } from "../icons"

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) {
    return null
  }

  return (
    <Card className="fixed top-20 left-4 right-4 z-40 bg-yellow-600 border-0 shadow-lg animate-slide-down md:left-auto md:right-4 md:max-w-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <AlertIcon size="sm" className="text-white" />
          <div>
            <p className="text-white font-medium text-sm">Mode Offline</p>
            <p className="text-white/90 text-xs">Beberapa fitur mungkin tidak tersedia</p>
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
