"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

export function PWAInstallStep({ onNext, onPrev, onComplete }: OnboardingStepProps) {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [installStatus, setInstallStatus] = useState<"idle" | "installing" | "success" | "error">("idle")

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstallStatus("success")
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return

    setIsInstalling(true)
    setInstallStatus("installing")

    try {
      const result = await installPrompt.prompt()

      if (result.outcome === "accepted") {
        setInstallStatus("success")
        setInstallPrompt(null)
        setCanInstall(false)
      } else {
        setInstallStatus("idle")
      }
    } catch (error) {
      console.error("Install failed:", error)
      setInstallStatus("error")
    } finally {
      setIsInstalling(false)
    }
  }

  const handleSkipInstall = () => {
    onComplete()
  }

  const handleCompleteOnboarding = () => {
    onComplete()
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">📱 Install AI Writer Pro</h2>
        <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto px-2">
          Dapatkan pengalaman terbaik dengan menginstall aplikasi ke device Anda
        </p>
      </div>

      {/* Installation Status */}
      {installStatus === "success" ? (
        <div className="max-w-2xl mx-auto animate-bounce-in px-2">
          <Card className="border-2 border-green-500 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
            <CardContent className="p-4 md:p-8 text-center space-y-3 md:space-y-4">
              <div className="text-4xl md:text-6xl animate-bounce">🎉</div>
              <h3 className="text-lg md:text-2xl font-bold text-white">Berhasil Diinstall!</h3>
              <p className="text-gray-300 text-sm md:text-base">
                AI Writer Pro sudah terinstall di device Anda. Sekarang Anda bisa mengaksesnya seperti aplikasi native!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">✓ Offline Ready</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">✓ Fast Loading</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                  ✓ Native Experience
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 px-2">
          {/* PWA Benefits */}
          <Card className="border border-gray-700 bg-gray-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base md:text-lg">Keunggulan Install App</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { icon: "⚡", title: "Akses Offline", desc: "Bekerja tanpa koneksi internet" },
                  { icon: "🚀", title: "Loading Super Cepat", desc: "Performa seperti aplikasi native" },
                  { icon: "🔔", title: "Push Notifications", desc: "Dapatkan update terbaru" },
                  { icon: "📱", title: "Home Screen", desc: "Akses langsung dari home screen" },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 md:gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="text-lg md:text-2xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white text-xs md:text-sm">{benefit.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Install Instructions */}
          <Card className="border border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                <div className="text-lg md:text-xl">📋</div>
                Cara Install (Manual)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-300">
                <div className="flex items-start gap-2 md:gap-3">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">Chrome</Badge>
                  <p>Menu (⋮) → Install AI Writer Pro → Install</p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">Safari</Badge>
                  <p>Share (📤) → Add to Home Screen</p>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">Edge</Badge>
                  <p>Menu (⋯) → Apps → Install this site as an app</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Install Button */}
          {canInstall && (
            <Card className="border-2 border-dashed border-green-500 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                <div className="text-3xl md:text-4xl animate-bounce">📱</div>
                <h3 className="text-lg md:text-xl font-bold text-white">Ready to Install!</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  Browser Anda mendukung instalasi otomatis. Klik tombol di bawah untuk install.
                </p>
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full md:w-auto"
                >
                  {isInstalling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Installing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      Install Sekarang
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Completion Message */}
      <div className="text-center space-y-3 md:space-y-4 px-2">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 md:p-6 max-w-2xl mx-auto">
          <div className="space-y-2 md:space-y-3">
            <div className="text-2xl md:text-3xl">🎊</div>
            <h3 className="text-lg md:text-xl font-bold text-white">Selamat! Setup Selesai</h3>
            <p className="text-gray-300 text-sm md:text-base">
              Anda sudah siap menggunakan AI Writer Pro untuk membuat konten berkualitas tinggi!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3 md:mt-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">✓ Tutorial Selesai</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">✓ Siap Digunakan</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                ✓ Pro Tips Unlocked
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Fixed Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 px-2">
        <Button
          onClick={onPrev}
          variant="ghost"
          className="text-gray-400 hover:text-white w-full sm:w-auto order-2 sm:order-1"
        >
          ← Kembali
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
          {!canInstall && installStatus !== "success" && (
            <Button
              onClick={handleSkipInstall}
              variant="ghost"
              className="text-gray-400 hover:text-white w-full sm:w-auto"
            >
              Lewati Install
            </Button>
          )}

          <Button
            onClick={handleCompleteOnboarding}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 md:px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <span>🚀</span>
              Mulai Menggunakan
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
