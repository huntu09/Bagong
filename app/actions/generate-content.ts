"use server"

import { advancedContentGenerator, type GenerationOptions } from "../lib/advanced-content-generator"
import { DemoContentGenerator } from "../lib/demo-content-generator"
import { checkConfiguration } from "../lib/config-checker"
import { contentQualityAnalyzer } from "../lib/content-quality-analyzer"

export interface GenerateContentState {
  content?: string
  qualityAnalysis?: any
  alternatives?: string[]
  metadata?: {
    wordCount: number
    readingTime: number
    generationTime: number
    iterations: number
  }
  error?: string
  isDemoMode?: boolean
}

export async function generateContent(
  prevState: GenerateContentState | null,
  formData: FormData,
): Promise<GenerateContentState> {
  try {
    const contentType = formData.get("contentType") as string
    const topic = formData.get("topic") as string
    const writingStyle = formData.get("writingStyle") as string
    const selectedTemplate = formData.get("selectedTemplate") as string

    // Validation
    if (!contentType || !topic || !writingStyle || !selectedTemplate) {
      return {
        error: "Semua field harus diisi",
      }
    }

    // Check configuration
    const config = checkConfiguration()

    if (!config.openaiConfigured) {
      // Demo mode - generate demo content
      const startTime = Date.now()
      const demoContent = DemoContentGenerator.generateDemoContent(contentType, topic, writingStyle)
      const qualityAnalysis = contentQualityAnalyzer.analyzeContent(demoContent, contentType, topic)

      const wordCount = demoContent.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)
      const generationTime = Date.now() - startTime

      return {
        content: demoContent,
        qualityAnalysis,
        alternatives: [
          `${demoContent}\n\n*Versi alternatif 1 - Demo Mode*`,
          `${demoContent}\n\n*Versi alternatif 2 - Demo Mode*`,
        ],
        metadata: {
          wordCount,
          readingTime,
          generationTime,
          iterations: 1,
        },
        isDemoMode: true,
      }
    }

    // Production mode - use AI
    const options: GenerationOptions = {
      contentType,
      topic,
      writingStyle,
      template: selectedTemplate,
      targetAudience: "General Indonesian audience",
      tone: writingStyle,
      length: "medium",
      includeExamples: true,
      includeSources: false,
      seoKeywords: topic.split(" ").slice(0, 3),
    }

    const result = await advancedContentGenerator.generateAdvancedContent(options)

    return {
      content: result.content,
      qualityAnalysis: result.qualityAnalysis,
      alternatives: result.alternatives,
      metadata: result.metadata,
      isDemoMode: false,
    }
  } catch (error) {
    console.error("Content generation failed:", error)
    return {
      error: "Terjadi kesalahan saat generate konten. Silakan coba lagi.",
    }
  }
}
