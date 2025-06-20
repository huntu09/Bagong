"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

const templateExamples = {
  artikel: [
    {
      id: "tutorial",
      name: "Template Tutorial",
      description: "Panduan step-by-step yang mudah diikuti",
      structure: ["Pendahuluan", "Persiapan", "Langkah-langkah", "Tips & Trik", "Kesimpulan"],
      preview:
        "Cara Membuat Website dengan React\n\n1. Persiapan Environment\n2. Setup Project\n3. Membuat Components...",
    },
    {
      id: "review",
      name: "Template Review",
      description: "Review produk yang objektif dan informatif",
      structure: ["Overview", "Kelebihan", "Kekurangan", "Perbandingan", "Rekomendasi"],
      preview:
        "Review iPhone 15 Pro: Inovasi Terbaru Apple\n\nKelebihan:\n✓ Kamera yang luar biasa\n✓ Performa tinggi...",
    },
  ],
  "tugas-sekolah": [
    {
      id: "essay",
      name: "Template Essay",
      description: "Struktur essay akademik yang sistematis",
      structure: ["Pendahuluan", "Tesis", "Argumen 1", "Argumen 2", "Kesimpulan"],
      preview: "Dampak Teknologi AI dalam Pendidikan\n\nPendahuluan:\nTeknologi AI telah mengubah cara kita belajar...",
    },
    {
      id: "laporan",
      name: "Template Laporan",
      description: "Format laporan ilmiah yang terstruktur",
      structure: ["Abstrak", "Latar Belakang", "Metodologi", "Hasil", "Pembahasan"],
      preview: "Laporan Penelitian: Efektivitas Pembelajaran Online\n\nAbstrak:\nPenelitian ini menganalisis...",
    },
  ],
}

export function TemplateDemoStep({ onNext, onPrev }: OnboardingStepProps) {
  const [selectedContentType] = useState("artikel") // Default for demo
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [typingText, setTypingText] = useState("")

  const templates = templateExamples[selectedContentType as keyof typeof templateExamples] || []
  const currentTemplate = templates.find((t) => t.id === selectedTemplate)

  // Typing animation effect
  useEffect(() => {
    if (showPreview && currentTemplate) {
      setTypingText("")
      let i = 0
      const text = currentTemplate.preview
      const timer = setInterval(() => {
        if (i < text.length) {
          setTypingText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [showPreview, currentTemplate])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowPreview(true)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">🎨 Template Cerdas untuk Setiap Kebutuhan</h2>
        <p className="text-gray-300 max-w-lg mx-auto">
          AI akan menyesuaikan gaya penulisan dengan template yang Anda pilih untuk hasil yang optimal!
        </p>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {templates.map((template, index) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-300 border-2 animate-fade-in-up hover:scale-105 ${
              selectedTemplate === template.id
                ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center justify-between">
                {template.name}
                {selectedTemplate === template.id && (
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
              <p className="text-sm text-gray-400">{template.description}</p>

              {/* Structure Preview */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Struktur template:</p>
                <div className="flex flex-wrap gap-1">
                  {template.structure.map((item, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`text-xs transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? "border-green-500/50 text-green-300"
                          : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {i + 1}. {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview */}
      {showPreview && currentTemplate && (
        <div className="max-w-4xl mx-auto animate-slide-down">
          <Card className="border-2 border-dashed border-blue-500 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
            <CardHeader className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                Live Preview - {currentTemplate.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </pre>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI sedang menulis dengan template {currentTemplate.name}</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">✨ AI Magic</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Benefits Highlight */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 max-w-4xl mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-green-400 text-xl">🎯</div>
          <div>
            <p className="text-sm text-green-300 font-medium">Keunggulan Template AI:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Struktur yang sudah terbukti efektif</li>
              <li>• Disesuaikan dengan standar industri</li>
              <li>• Menghasilkan konten yang lebih terorganisir</li>
              <li>• Menghemat waktu brainstorming</li>
            </ul>
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
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Coba Generate →
        </Button>
      </div>
    </div>
  )
}
