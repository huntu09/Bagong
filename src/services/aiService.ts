"use client"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { GenerationOptions, GenerationResult, QualityAnalysis } from "@types/index"

class AIService {
  private apiKey: string | null = null

  constructor() {
    this.loadApiKey()
  }

  private async loadApiKey() {
    try {
      const storedKey = await AsyncStorage.getItem("openai_api_key")
      this.apiKey = storedKey
    } catch (error) {
      console.error("Error loading API key:", error)
    }
  }

  async setApiKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem("openai_api_key", key)
      this.apiKey = key
    } catch (error) {
      console.error("Error saving API key:", error)
      throw new Error("Gagal menyimpan API key")
    }
  }

  async generateContent(options: GenerationOptions): Promise<GenerationResult> {
    if (!this.apiKey) {
      throw new Error("API key belum dikonfigurasi. Silakan masukkan API key di pengaturan.")
    }

    try {
      const prompt = this.buildPrompt(options)

      const { text } = await generateText({
        model: openai("gpt-4o-mini", { apiKey: this.apiKey }),
        prompt,
        maxTokens: this.getMaxTokens(options.wordCount),
        temperature: 0.7,
      })

      const content = text.trim()
      const metadata = this.generateMetadata(content, options)
      const qualityAnalysis = this.analyzeQuality(content, options)

      return {
        content,
        metadata,
        qualityAnalysis,
      }
    } catch (error: any) {
      console.error("AI Service Error:", error)
      if (error.message?.includes("401")) {
        throw new Error("API key tidak valid. Silakan periksa kembali API key Anda.")
      }
      throw new Error("Gagal membuat konten. Silakan coba lagi.")
    }
  }

  private buildPrompt(options: GenerationOptions): string {
    const {
      topic,
      contentType,
      writingStyle,
      targetAudience,
      wordCount,
      includeKeywords,
      customInstructions,
      template,
    } = options

    let prompt = `Buatlah konten ${contentType} dalam bahasa Indonesia dengan detail berikut:

TOPIK: ${topic}
GAYA PENULISAN: ${writingStyle}
TARGET AUDIENS: ${targetAudience}
PANJANG: Sekitar ${wordCount} kata`

    if (template) {
      prompt += `\nTEMPLATE: ${template}`
    }

    prompt += `\n\nINSTRUKSI KHUSUS:
- Gunakan bahasa Indonesia yang baik dan benar
- Sesuaikan tone dengan gaya penulisan yang dipilih
- Buat konten yang engaging dan informatif
- Pastikan struktur konten jelas dan mudah dibaca`

    if (includeKeywords && includeKeywords.length > 0) {
      prompt += `\nKATA KUNCI: ${includeKeywords.join(", ")}`
    }

    if (customInstructions) {
      prompt += `\nINSTRUKSI TAMBAHAN: ${customInstructions}`
    }

    prompt += `\n\nHasilkan konten yang berkualitas tinggi, original, dan sesuai dengan semua parameter di atas.`

    return prompt
  }

  private getMaxTokens(wordCount: number): number {
    return Math.ceil(wordCount * 1.5)
  }

  private generateMetadata(content: string, options: GenerationOptions) {
    const words = content.trim().split(/\s+/)
    const wordCount = words.length
    const characterCount = content.length
    const paragraphCount = content.split(/\n\s*\n/).length
    const readingTime = Math.ceil(wordCount / 200)

    return {
      wordCount,
      characterCount,
      paragraphCount,
      readingTime,
      contentType: options.contentType,
      writingStyle: options.writingStyle,
      targetAudience: options.targetAudience,
      keywords: options.includeKeywords || [],
    }
  }

  private analyzeQuality(content: string, options: GenerationOptions): QualityAnalysis {
    const wordCount = content.trim().split(/\s+/).length
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgWordsPerSentence = wordCount / sentences.length

    const readabilityScore = this.calculateReadabilityScore(avgWordsPerSentence, content)
    const grammarScore = this.calculateGrammarScore(content)
    const coherenceScore = this.calculateCoherenceScore(content, options)
    const engagementScore = this.calculateEngagementScore(content, options)
    const seoScore = this.calculateSEOScore(content, options)

    const overallScore = (readabilityScore + grammarScore + coherenceScore + engagementScore + seoScore) / 5

    return {
      overallScore: Math.round(overallScore * 10) / 10,
      readabilityScore: Math.round(readabilityScore * 10) / 10,
      grammarScore: Math.round(grammarScore * 10) / 10,
      coherenceScore: Math.round(coherenceScore * 10) / 10,
      engagementScore: Math.round(engagementScore * 10) / 10,
      seoScore: Math.round(seoScore * 10) / 10,
      strengths: this.generateStrengths(content, options),
      suggestions: this.generateSuggestions(content, options),
      improvements: this.generateImprovements(content, options),
    }
  }

  private calculateReadabilityScore(avgWordsPerSentence: number, content: string): number {
    let score = 8.0
    if (avgWordsPerSentence > 25) score -= 1.5
    if (avgWordsPerSentence > 30) score -= 1.0
    if (avgWordsPerSentence < 10) score += 0.5
    return Math.max(1, Math.min(10, score))
  }

  private calculateGrammarScore(content: string): number {
    let score = 8.5
    const commonErrors = [/\s{2,}/g]
    commonErrors.forEach((pattern) => {
      const matches = content.match(pattern) || []
      score -= matches.length * 0.2
    })
    return Math.max(1, Math.min(10, score))
  }

  private calculateCoherenceScore(content: string, options: GenerationOptions): number {
    let score = 7.5
    const paragraphs = content.split(/\n\s*\n/)
    if (paragraphs.length < 2) score -= 1.0
    if (paragraphs.length > 10) score += 0.5
    return Math.max(1, Math.min(10, score))
  }

  private calculateEngagementScore(content: string, options: GenerationOptions): number {
    let score = 7.0
    if (/\?/.test(content)) score += 0.5
    if (/!/.test(content)) score += 0.3
    if (/\d+/.test(content)) score += 0.4
    return Math.max(1, Math.min(10, score))
  }

  private calculateSEOScore(content: string, options: GenerationOptions): number {
    let score = 6.0
    if (options.includeKeywords && options.includeKeywords.length > 0) {
      const keywordUsage = options.includeKeywords.filter((keyword) =>
        content.toLowerCase().includes(keyword.toLowerCase()),
      ).length
      score += (keywordUsage / options.includeKeywords.length) * 2
    }
    return Math.max(1, Math.min(10, score))
  }

  private generateStrengths(content: string, options: GenerationOptions): string[] {
    const strengths: string[] = []
    const wordCount = content.split(/\s+/).length
    if (wordCount >= options.wordCount * 0.9) {
      strengths.push("Panjang konten sesuai dengan target")
    }
    if (content.includes("?")) {
      strengths.push("Menggunakan pertanyaan untuk meningkatkan engagement")
    }
    return strengths
  }

  private generateSuggestions(content: string, options: GenerationOptions): string[] {
    const suggestions: string[] = []
    const wordCount = content.split(/\s+/).length
    if (wordCount < options.wordCount * 0.8) {
      suggestions.push("Pertimbangkan untuk menambah detail atau contoh")
    }
    return suggestions
  }

  private generateImprovements(content: string, options: GenerationOptions): string[] {
    const improvements: string[] = []
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgWordsPerSentence = content.split(/\s+/).length / sentences.length
    if (avgWordsPerSentence > 25) {
      improvements.push("Pertimbangkan untuk memecah kalimat yang terlalu panjang")
    }
    return improvements
  }
}

export const aiService = new AIService()
