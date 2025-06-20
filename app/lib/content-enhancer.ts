import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface EnhancementSuggestion {
  type: "grammar" | "style" | "structure" | "engagement" | "seo"
  original: string
  improved: string
  reason: string
  confidence: number
}

export interface EnhancementResult {
  enhancedContent: string
  suggestions: EnhancementSuggestion[]
  improvementScore: number
}

export class ContentEnhancer {
  private static instance: ContentEnhancer

  static getInstance(): ContentEnhancer {
    if (!ContentEnhancer.instance) {
      ContentEnhancer.instance = new ContentEnhancer()
    }
    return ContentEnhancer.instance
  }

  async enhanceContent(
    content: string,
    contentType: string,
    focusAreas: string[] = ["grammar", "style", "engagement"],
  ): Promise<EnhancementResult> {
    try {
      const enhancementPrompt = this.buildEnhancementPrompt(content, contentType, focusAreas)

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system:
          "Anda adalah editor profesional yang ahli dalam memperbaiki dan meningkatkan kualitas konten bahasa Indonesia.",
        prompt: enhancementPrompt,
        maxTokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent improvements
      })

      return this.parseEnhancementResult(text, content)
    } catch (error) {
      console.error("Content enhancement failed:", error)
      return {
        enhancedContent: content,
        suggestions: [],
        improvementScore: 0,
      }
    }
  }

  async generateAlternativeVersions(content: string, contentType: string, count = 3): Promise<string[]> {
    const alternatives: string[] = []

    for (let i = 0; i < count; i++) {
      try {
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system:
            "Anda adalah copywriter kreatif yang membuat variasi konten dengan gaya yang berbeda namun tetap mempertahankan pesan utama.",
          prompt: `Buat ulang konten berikut dengan gaya yang berbeda namun tetap mempertahankan informasi dan pesan utama:

Konten asli:
${content}

Tipe konten: ${contentType}

Variasi ke-${i + 1}: Buat dengan pendekatan yang ${i === 0 ? "lebih formal dan profesional" : i === 1 ? "lebih santai dan conversational" : "lebih kreatif dan engaging"}.`,
          maxTokens: 1500,
          temperature: 0.7 + i * 0.1, // Increase creativity for each version
        })

        alternatives.push(text)
      } catch (error) {
        console.error(`Failed to generate alternative ${i + 1}:`, error)
      }
    }

    return alternatives
  }

  async optimizeForSEO(content: string, targetKeywords: string[]): Promise<string> {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system:
          "Anda adalah SEO specialist yang ahli dalam mengoptimasi konten untuk mesin pencari tanpa mengurangi kualitas dan keterbacaan.",
        prompt: `Optimasi konten berikut untuk SEO dengan kata kunci target: ${targetKeywords.join(", ")}

Konten asli:
${content}

Petunjuk optimasi:
1. Gunakan kata kunci secara natural (density 1-3%)
2. Tambahkan heading yang mengandung kata kunci
3. Perbaiki struktur untuk SEO
4. Jaga keterbacaan dan kualitas konten
5. Tambahkan meta description suggestion di akhir

Berikan hasil optimasi:`,
        maxTokens: 2000,
        temperature: 0.4,
      })

      return text
    } catch (error) {
      console.error("SEO optimization failed:", error)
      return content
    }
  }

  private buildEnhancementPrompt(content: string, contentType: string, focusAreas: string[]): string {
    const focusInstructions = {
      grammar: "Perbaiki tata bahasa, ejaan, dan struktur kalimat",
      style: "Tingkatkan gaya penulisan agar lebih menarik dan profesional",
      structure: "Perbaiki struktur dan organisasi konten",
      engagement: "Tambahkan elemen yang lebih engaging dan menarik pembaca",
      seo: "Optimasi untuk SEO tanpa mengurangi kualitas",
    }

    const instructions = focusAreas.map((area) => focusInstructions[area as keyof typeof focusInstructions]).join(", ")

    return `Tingkatkan kualitas konten berikut dengan fokus pada: ${instructions}

Tipe konten: ${contentType}
Konten asli:
${content}

Berikan hasil perbaikan dalam format:
ENHANCED_CONTENT:
[konten yang sudah diperbaiki]

IMPROVEMENTS:
[list perbaikan yang dilakukan dengan format: "ORIGINAL: [teks asli] -> IMPROVED: [teks perbaikan] (REASON: [alasan perbaikan])"]

Pastikan:
1. Mempertahankan pesan dan informasi utama
2. Menggunakan bahasa Indonesia yang baik dan benar
3. Meningkatkan keterbacaan dan engagement
4. Memberikan perbaikan yang signifikan`
  }

  private parseEnhancementResult(aiResponse: string, originalContent: string): EnhancementResult {
    const sections = aiResponse.split("IMPROVEMENTS:")
    const enhancedContent = sections[0]?.replace("ENHANCED_CONTENT:", "").trim() || originalContent
    const improvementsText = sections[1]?.trim() || ""

    const suggestions: EnhancementSuggestion[] = []

    if (improvementsText) {
      const improvements = improvementsText.split("\n").filter((line) => line.includes("->"))

      improvements.forEach((improvement) => {
        const match = improvement.match(/ORIGINAL:\s*(.+?)\s*->\s*IMPROVED:\s*(.+?)\s*$$REASON:\s*(.+?)$$/)
        if (match) {
          suggestions.push({
            type: "style", // Default type, could be enhanced with better parsing
            original: match[1].trim(),
            improved: match[2].trim(),
            reason: match[3].trim(),
            confidence: 0.8, // Default confidence
          })
        }
      })
    }

    // Calculate improvement score based on number and quality of suggestions
    const improvementScore = Math.min(10, suggestions.length * 1.5)

    return {
      enhancedContent,
      suggestions,
      improvementScore,
    }
  }
}

export const contentEnhancer = ContentEnhancer.getInstance()
