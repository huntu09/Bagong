"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SparklesIcon, LoadingIcon } from "@/app/icons"
import type { OnboardingStepProps } from "@/app/hooks/use-onboarding"

const demoContent = `# Dampak Artificial Intelligence dalam Pendidikan Modern

## Pendahuluan

Artificial Intelligence (AI) telah menjadi salah satu teknologi paling revolusioner di abad ke-21. Dalam bidang pendidikan, AI membawa transformasi yang signifikan dalam cara kita belajar dan mengajar.

## Manfaat AI dalam Pendidikan

### 1. Personalisasi Pembelajaran
AI memungkinkan sistem pembelajaran yang dapat menyesuaikan dengan gaya belajar setiap siswa. Algoritma machine learning dapat menganalisis pola belajar dan memberikan rekomendasi yang tepat.

### 2. Otomatisasi Tugas Administratif
Guru dapat fokus pada pengajaran karena AI membantu mengotomatisasi tugas-tugas seperti penilaian, penjadwalan, dan pelaporan.

### 3. Aksesibilitas yang Lebih Baik
AI membantu menciptakan lingkungan belajar yang lebih inklusif dengan teknologi seperti text-to-speech dan translation tools.

## Tantangan dan Solusi

Meskipun memberikan banyak manfaat, implementasi AI dalam pendidikan juga menghadapi tantangan seperti:
- Kebutuhan infrastruktur teknologi
- Pelatihan tenaga pendidik
- Isu privasi dan keamanan data

## Kesimpulan

AI dalam pendidikan bukan hanya tentang teknologi, tetapi tentang menciptakan pengalaman belajar yang lebih efektif dan personal. Dengan implementasi yang tepat, AI dapat menjadi katalis untuk revolusi pendidikan yang lebih baik.`

export function AIDemoStep({ onNext, onPrev }: OnboardingStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    "Menganalisis topik...",
    "Memilih template yang sesuai...",
    "Mengumpulkan informasi...",
    "Menyusun struktur konten...",
    "Menulis dengan AI...",
    "Mengoptimalkan hasil...",
  ]

  const handleGenerate = () => {
    setIsGenerating(true)
    setShowResult(false)
    setCurrentPhase(0)

    // Simulate AI generation phases
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev < phases.length - 1) {
          return prev + 1
        } else {
          clearInterval(phaseInterval)
          setTimeout(() => {
            setIsGenerating(false)
            setShowResult(true)
          }, 1000)
          return prev
        }
      })
    }, 800)
  }

  // Typing animation for result
  useEffect(() => {
    if (showResult) {
      setTypingText("")
      let i = 0
      const timer = setInterval(() => {
        if (i < demoContent.length) {
          setTypingText(demoContent.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 15)
      return () => clearInterval(timer)
    }
  }, [showResult])

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">🤖 Lihat Keajaiban AI Bekerja!</h2>
        <p className="text-gray-300 max-w-lg mx-auto">
          Mari coba generate konten dengan AI dan lihat hasilnya dalam hitungan detik
        </p>
      </div>

      {/* Demo Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="border border-gray-700 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <SparklesIcon size="sm" />
              Demo Generator AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tipe Konten</label>
              <Select defaultValue="artikel" disabled>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artikel">📝 Artikel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Topik</label>
              <Input
                defaultValue="Dampak AI di Pendidikan"
                disabled
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Writing Style */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Gaya Bahasa</label>
              <Select defaultValue="formal" disabled>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon size="sm" />
                  <span>{phases[currentPhase]}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SparklesIcon size="sm" />
                  Generate Teks
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="border border-blue-500 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 font-medium">AI sedang bekerja...</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {Math.round(((currentPhase + 1) / phases.length) * 100)}%
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
                  ></div>
                </div>

                {/* Current Phase */}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>{phases[currentPhase]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated Result */}
      {showResult && (
        <div className="max-w-4xl mx-auto animate-scale-in">
          <Card className="border-2 border-dashed border-green-500 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader className="bg-gradient-to-r from-green-600/20 to-emerald-600/20">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  Hasil Generate - Selesai dalam 10 detik! 🎉
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✨ AI Magic</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={typingText}
                readOnly
                className="min-h-[400px] text-sm leading-relaxed resize-none bg-gray-900 border-gray-700 text-white"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>1,247 kata</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Struktur optimal</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>SEO friendly</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Message */}
      {showResult && (
        <div className="text-center space-y-4 animate-bounce-in">
          <div className="text-4xl">🎯</div>
          <h3 className="text-xl font-bold text-white">Hasil Berkualitas Tinggi dalam 10 Detik!</h3>
          <p className="text-gray-300 max-w-md mx-auto">
            Inilah kekuatan AI Writer Pro - konten berkualitas profesional dengan cepat dan mudah!
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button onClick={onPrev} variant="ghost" className="text-gray-400 hover:text-white">
          ← Kembali
        </Button>

        <Button
          onClick={onNext}
          disabled={!showResult}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            showResult
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Keren! Lanjut →
        </Button>
      </div>
    </div>
  )
}
