"use client"

import { useState, useCallback } from "react"
import { aiService } from "@services/aiService"
import type { GenerationOptions, GenerationResult } from "@types/index"

export const useContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const generateContent = useCallback(async (options: GenerationOptions) => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setResult(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      const generatedResult = await aiService.generateContent(options)

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setResult(generatedResult)
        setIsGenerating(false)
        setProgress(0)
      }, 500)
    } catch (err: any) {
      setError(err.message || "Gagal membuat konten")
      setIsGenerating(false)
      setProgress(0)
    }
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
    setProgress(0)
  }, [])

  const regenerateContent = useCallback(
    async (options: GenerationOptions) => {
      await generateContent(options)
    },
    [generateContent],
  )

  return {
    isGenerating,
    result,
    error,
    progress,
    generateContent,
    clearResult,
    regenerateContent,
  }
}
