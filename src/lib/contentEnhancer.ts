import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface EnhancementResult {
  enhancedContent: string
  improvementScore: number
  changes: string[]
}

export class ContentEnhancer {
  private static instance: ContentEnhancer

  static getInstance(): ContentEnhancer {
    if (!ContentEnhancer.instance) {
      ContentEnhancer.instance = new ContentEnhancer()
    }
    return ContentEnhancer.instance
  }

  async enhanceContent(content: string, contentType: string): Promise<EnhancementResult> {
    const systemPrompt = `Anda adalah editor profesional yang ahli dalam meningkatkan kualitas konten bahasa Indonesia.`

    const userPrompt = `Tingkatkan kualitas konten ${contentType} berikut ini:

KONTEN ASLI:
${content}

INSTRUKSI PENINGKATAN:
1. Perbaiki struktur dan flow
2. Tingkatkan keterbacaan
3. Tambahkan detail yang relevan
4. Perbaiki grammar dan ejaan
5. Buat lebih engaging

Berikan hasil yang lebih baik dari konten asli.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 2000,
      temperature: 0.3,
    })

    // Calculate improvement score (simplified)
    const originalLength = content.length
    const enhancedLength = text.length
    const improvementScore = enhancedLength > originalLength ? 1.2 : 1.0

    return {
      enhancedContent: text,
      improvementScore,
      changes: ["Struktur diperbaiki", "Keterbacaan ditingkatkan", "Detail ditambahkan"],
    }
  }

  async generateAlternativeVersions(content: string, contentType: string, count = 2): Promise<string[]> {
    const alternatives: string[] = []

    for (let i = 0; i < count; i++) {
      const systemPrompt = `Anda adalah content creator yang membuat variasi konten dengan gaya berbeda.`

      const approaches = [
        "Buat versi yang lebih formal dan profesional",
        "Buat versi yang lebih santai dan conversational",
        "Buat versi yang lebih ringkas dan to-the-point",
      ]

      const userPrompt = `${approaches[i] || approaches[0]}

KONTEN ASLI:
${content}

Buat versi alternatif yang tetap mempertahankan inti pesan tapi dengan pendekatan yang berbeda.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 1500,
        temperature: 0.7 + i * 0.1,
      })

      alternatives.push(text)
    }

    return alternatives
  }
}

export const contentEnhancer = ContentEnhancer.getInstance()
