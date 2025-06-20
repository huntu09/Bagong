"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SaveIcon, CopyIcon, ShareIcon } from "@/app/icons"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

const features = [
  {
    id: "save",
    title: "Simpan Konten",
    description: "Semua konten tersimpan otomatis di device Anda",
    icon: SaveIcon,
    color: "from-green-500 to-green-600",
    demo: "Konten disimpan ke sidebar →",
    benefits: ["Akses offline", "Tidak hilang", "Mudah dikelola"],
  },
  {
    id: "copy",
    title: "Copy & Share",
    description: "Salin ke clipboard atau bagikan langsung",
    icon: CopyIcon,
    color: "from-blue-500 to-blue-600",
    demo: "Copied to clipboard! ✓",
    benefits: ["One-click copy", "Share ke social media", "Export ke file"],
  },
  {
    id: "sync",
    title: "Sync Antar Device",
    description: "Akses konten dari mana saja dengan PWA",
    icon: ShareIcon,
    color: "from-purple-500 to-purple-600",
    demo: "Sync dengan cloud storage",
    benefits: ["Cross-platform", "Real-time sync", "Backup otomatis"],
  },
]

export function FeaturesStep({ onNext, onPrev }: OnboardingStepProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [demoStates, setDemoStates] = useState<Record<string, boolean>>({})

  const handleFeatureDemo = (featureId: string) => {
    setActiveDemo(featureId)
    setDemoStates((prev) => ({ ...prev, [featureId]: true }))

    // Reset demo state after animation
    setTimeout(() => {
      setActiveDemo(null)
    }, 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">💾 Simpan & Bagikan Karya Anda</h2>
        <p className="text-gray-300 max-w-lg mx-auto">
          Kelola konten Anda dengan mudah dan akses dari mana saja dengan fitur-fitur canggih
        </p>
      </div>

      {/* Features Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isActive = activeDemo === feature.id
          const isDemoCompleted = demoStates[feature.id]

          return (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 border-2 animate-fade-in-up hover:scale-105 ${
                isActive
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : isDemoCompleted
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleFeatureDemo(feature.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <Icon size="md" className="text-white" />
                    </div>
                    <span>{feature.title}</span>
                  </div>
                  {isDemoCompleted && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{feature.description}</p>

                {/* Demo Area */}
                <div
                  className={`p-3 rounded-lg border-2 border-dashed transition-all duration-300 ${
                    isActive
                      ? "border-blue-500 bg-blue-500/5"
                      : isDemoCompleted
                        ? "border-green-500 bg-green-500/5"
                        : "border-gray-600 bg-gray-700/30"
                  }`}
                >
                  <div className="text-center">
                    {isActive ? (
                      <div className="flex items-center justify-center gap-2 text-blue-300">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">{feature.demo}</span>
                      </div>
                    ) : isDemoCompleted ? (
                      <div className="text-green-300 text-sm">✓ Demo completed!</div>
                    ) : (
                      <div className="text-gray-500 text-sm">Klik untuk demo →</div>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Keunggulan:</p>
                  <div className="space-y-1">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* PWA Benefits */}
      <div className="max-w-4xl mx-auto">
        <Card className="border border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="text-2xl">📱</div>
              Progressive Web App (PWA) Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "⚡", title: "Akses Offline", desc: "Bekerja tanpa internet" },
                { icon: "🔔", title: "Notifikasi", desc: "Update & reminder" },
                { icon: "🚀", title: "Loading Cepat", desc: "Seperti app native" },
                { icon: "📱", title: "Install App", desc: "Tambah ke home screen" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center space-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="space-y-3">
            <div className="text-3xl">🎉</div>
            <h3 className="text-xl font-bold text-white">Siap untuk Install App?</h3>
            <p className="text-gray-300">Install AI Writer Pro sebagai aplikasi untuk pengalaman terbaik!</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">100% Gratis</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Offline Ready</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">No Ads</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button onClick={onPrev} variant="ghost" className="text-gray-400 hover:text-white">
          ← Kembali
        </Button>

        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Install App →
        </Button>
      </div>
    </div>
  )
}
