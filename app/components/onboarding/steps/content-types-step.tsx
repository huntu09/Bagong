"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArticleIcon, GraduationCapIcon, InstagramIcon, MailIcon } from "@/app/icons"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

const contentTypes = [
  {
    id: "artikel",
    title: "Artikel",
    description: "Blog post, berita, review produk",
    icon: ArticleIcon,
    color: "from-blue-500 to-blue-600",
    examples: ["Tutorial", "Review", "Berita", "Opinion"],
  },
  {
    id: "tugas-sekolah",
    title: "Tugas Sekolah",
    description: "Essay, laporan, presentasi",
    icon: GraduationCapIcon,
    color: "from-green-500 to-green-600",
    examples: ["Essay", "Laporan", "Makalah", "Analisis"],
  },
  {
    id: "caption-ig",
    title: "Caption IG",
    description: "Caption menarik untuk Instagram",
    icon: InstagramIcon,
    color: "from-pink-500 to-pink-600",
    examples: ["Lifestyle", "Business", "Travel", "Food"],
  },
  {
    id: "email-formal",
    title: "Email Formal",
    description: "Email bisnis dan profesional",
    icon: MailIcon,
    color: "from-purple-500 to-purple-600",
    examples: ["Lamaran", "Proposal", "Follow-up", "Thank you"],
  },
]

export function ContentTypesStep({ onNext, onPrev }: OnboardingStepProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [hoveredType, setHoveredType] = useState<string | null>(null)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">📝 Pilih Jenis Konten Anda</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Setiap jenis konten memiliki template khusus yang sudah dioptimasi untuk hasil terbaik!
        </p>
      </div>

      {/* Content Type Cards */}
      <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
        {contentTypes.map((type, index) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          const isHovered = hoveredType === type.id

          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-300 border-2 animate-fade-in-up hover:scale-[1.02] ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedType(type.id)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Icon and Title */}
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${type.color} shadow-lg`}>
                    <Icon size="sm" className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-base">{type.title}</h3>
                    <p className="text-xs text-gray-400">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center animate-scale-in">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Examples */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Contoh template:</p>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((example, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 text-xs rounded-full transition-all duration-200 ${
                          isSelected || isHovered
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-blue-400 text-xl">💡</div>
          <div>
            <p className="text-sm text-blue-300 font-medium">Tips Pro:</p>
            <p className="text-sm text-gray-300 mt-1">
              Pilih jenis konten yang paling sering Anda buat. Anda bisa menggunakan semua jenis kapan saja!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
        <Button
          onClick={onPrev}
          variant="ghost"
          className="text-gray-400 hover:text-white w-full sm:w-auto order-2 sm:order-1"
        >
          ← Kembali
        </Button>

        <Button
          onClick={onNext}
          disabled={!selectedType}
          className={`w-full sm:w-auto order-1 sm:order-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            selectedType
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Lanjut ke Template →
        </Button>
      </div>
    </div>
  )
}
