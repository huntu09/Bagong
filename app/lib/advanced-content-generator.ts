import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { contentQualityAnalyzer, type QualityAnalysis } from "./content-quality-analyzer"
import { contentEnhancer } from "./content-enhancer"

export interface GenerationOptions {
  contentType: string
  topic: string
  writingStyle: string
  template: string
  targetAudience?: string
  tone?: string
  length?: "short" | "medium" | "long"
  includeExamples?: boolean
  includeSources?: boolean
  seoKeywords?: string[]
}

export interface GenerationResult {
  content: string
  qualityAnalysis: QualityAnalysis
  alternatives: string[]
  metadata: {
    wordCount: number
    readingTime: number
    generationTime: number
    iterations: number
  }
}

export class AdvancedContentGenerator {
  private static instance: AdvancedContentGenerator

  static getInstance(): AdvancedContentGenerator {
    if (!AdvancedContentGenerator.instance) {
      AdvancedContentGenerator.instance = new AdvancedContentGenerator()
    }
    return AdvancedContentGenerator.instance
  }

  async generateAdvancedContent(options: GenerationOptions): Promise<GenerationResult> {
    const startTime = Date.now()
    let bestContent = ""
    let bestScore = 0
    let iterations = 0
    const maxIterations = 3

    // Generate multiple versions and pick the best one
    for (let i = 0; i < maxIterations; i++) {
      iterations++

      const content = await this.generateSingleVersion(options, i)
      const analysis = contentQualityAnalyzer.analyzeContent(content, options.contentType, options.topic)

      if (analysis.score.overall > bestScore) {
        bestContent = content
        bestScore = analysis.score.overall
      }

      // If we get a high-quality result early, we can stop
      if (analysis.score.overall >= 8.5) {
        break
      }
    }

    // Enhance the best content if score is below threshold
    if (bestScore < 8.0) {
      const enhanced = await contentEnhancer.enhanceContent(bestContent, options.contentType)
      if (enhanced.improvementScore > 0) {
        bestContent = enhanced.enhancedContent
      }
    }

    // Generate alternatives
    const alternatives = await contentEnhancer.generateAlternativeVersions(bestContent, options.contentType, 2)

    // Final quality analysis
    const finalAnalysis = contentQualityAnalyzer.analyzeContent(bestContent, options.contentType, options.topic)

    // Calculate metadata
    const wordCount = bestContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words/minute
    const generationTime = Date.now() - startTime

    return {
      content: bestContent,
      qualityAnalysis: finalAnalysis,
      alternatives,
      metadata: {
        wordCount,
        readingTime,
        generationTime,
        iterations,
      },
    }
  }

  private async generateSingleVersion(options: GenerationOptions, iteration: number): Promise<string> {
    const systemPrompt = this.buildAdvancedSystemPrompt(options)
    const userPrompt = this.buildAdvancedUserPrompt(options, iteration)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: this.getMaxTokens(options.length),
      temperature: 0.7 + iteration * 0.1, // Increase creativity with each iteration
    })

    return text
  }

  private buildAdvancedSystemPrompt(options: GenerationOptions): string {
    const basePrompt = `Anda adalah AI content creator expert yang menghasilkan konten berkualitas tinggi dalam bahasa Indonesia.`

    const expertiseMap = {
      artikel: "jurnalis dan penulis artikel profesional",
      "tugas-sekolah": "akademisi dan pendidik berpengalaman",
      "ringkasan-buku": "kritikus sastra dan reviewer buku",
      "caption-ig": "social media specialist dan content creator",
      "email-formal": "komunikasi bisnis dan professional writer",
    }

    const expertise = expertiseMap[options.contentType as keyof typeof expertiseMap] || "content creator profesional"

    return `${basePrompt} Anda memiliki keahlian sebagai ${expertise}.

Prinsip penulisan Anda:
1. Selalu mengutamakan kualitas dan akurasi informasi
2. Menggunakan bahasa Indonesia yang baik, benar, dan sesuai konteks
3. Membuat konten yang engaging dan mudah dipahami target audience
4. Mengoptimalkan struktur konten untuk keterbacaan maksimal
5. Menghindari plagiarisme dan selalu memberikan perspektif original

${options.targetAudience ? `Target audience: ${options.targetAudience}` : ""}
${options.tone ? `Tone yang diinginkan: ${options.tone}` : ""}`
  }

  private buildAdvancedUserPrompt(options: GenerationOptions, iteration: number): string {
    const templateStructures = this.getTemplateStructure(options.template)

    let prompt = `Buat ${options.contentType} tentang "${options.topic}" dengan gaya ${options.writingStyle}.

STRUKTUR TEMPLATE:
${templateStructures}

REQUIREMENTS:
- Panjang: ${this.getLengthRequirement(options.length)}
- Gaya: ${options.writingStyle}
- Kualitas: Premium dan professional`

    if (options.includeExamples) {
      prompt += `\n- Sertakan contoh konkret dan relevan`
    }

    if (options.includeSources) {
      prompt += `\n- Tambahkan referensi atau sumber (gunakan format umum, bukan URL spesifik)`
    }

    if (options.seoKeywords && options.seoKeywords.length > 0) {
      prompt += `\n- Optimasi untuk kata kunci: ${options.seoKeywords.join(", ")} (gunakan secara natural)`
    }

    // Add variation instruction for iterations
    if (iteration > 0) {
      const approaches = [
        "Gunakan pendekatan yang lebih data-driven dan faktual",
        "Fokus pada storytelling dan narrative yang kuat",
        "Emphasize pada practical tips dan actionable insights",
      ]
      prompt += `\n\nPENDEKATAN KHUSUS: ${approaches[iteration - 1] || approaches[0]}`
    }

    prompt += `\n\nPastikan konten:
1. Original dan tidak klise
2. Informatif dan bernilai tinggi
3. Engaging dari awal hingga akhir
4. Terstruktur dengan baik
5. Sesuai dengan target audience dan tujuan konten`

    return prompt
  }

  private getTemplateStructure(template: string): string {
    // This would contain all your existing template structures
    const templates = {
      berita:
        "1) Headline menarik, 2) Lead paragraph dengan 5W+1H, 3) Body dengan fakta dan data, 4) Quote dari narasumber, 5) Kesimpulan yang kuat",
      tutorial:
        "1) Pengenalan masalah yang akan diselesaikan, 2) Tools/bahan yang dibutuhkan, 3) Langkah-langkah detail dengan numbering, 4) Tips dan troubleshooting, 5) Kesimpulan dan next steps",
      // Add all other templates...
    }

    return templates[template as keyof typeof templates] || "Gunakan struktur yang logis dan mudah diikuti"
  }

  private getLengthRequirement(length?: string): string {
    switch (length) {
      case "short":
        return "200-500 kata"
      case "medium":
        return "500-1000 kata"
      case "long":
        return "1000-2000 kata"
      default:
        return "500-1000 kata"
    }
  }

  private getMaxTokens(length?: string): number {
    switch (length) {
      case "short":
        return 800
      case "medium":
        return 1500
      case "long":
        return 2500
      default:
        return 1500
    }
  }
}

export const advancedContentGenerator = AdvancedContentGenerator.getInstance()
