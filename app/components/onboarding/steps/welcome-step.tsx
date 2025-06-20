"use client"
import { Button } from "@/components/ui/button"
import { SparklesIcon } from "@/app/icons"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

export function WelcomeStep({ onNext, onSkip }: OnboardingStepProps) {
  return (
    <div className="text-center space-y-4 sm:space-y-6 animate-fade-in-up min-h-full flex flex-col justify-center">
      {/* Hero Animation */}
      <div className="relative">
        <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 sm:mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
            <SparklesIcon size="lg" color="primary" className="animate-spin-slow" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
          Selamat Datang di AI Writer Pro! 🎉
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto leading-relaxed px-4">
          Generator Konten AI Terpintar untuk Semua Kebutuhan Anda
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mt-4 sm:mt-6 px-4">
        {[
          { icon: "📝", text: "Artikel berkualitas dalam hitungan detik" },
          { icon: "🎓", text: "Tugas sekolah yang impressive" },
          { icon: "📱", text: "Caption IG yang engaging" },
          { icon: "✉️", text: "Email formal yang profesional" },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="text-xl mb-1">{feature.icon}</div>
            <p className="text-xs sm:text-sm text-gray-300">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 justify-center mt-6 px-4">
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full text-base"
        >
          <SparklesIcon size="sm" className="mr-2" />
          Mulai Petualangan AI →
        </Button>

        <Button
          onClick={onSkip}
          variant="ghost"
          size="lg"
          className="text-gray-400 hover:text-white transition-colors w-full py-3"
        >
          Lewati Tutorial
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 mt-4 text-xs sm:text-sm text-gray-500 px-4">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>100% Gratis</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Offline Ready</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span>AI Powered</span>
        </div>
      </div>
    </div>
  )
}
