export interface QualityMetrics {
  overall: number
  readability: number
  structure: number
  engagement: number
  seo: number
  originality: number
  factualAccuracy: number
}

export interface QualityAnalysis {
  score: QualityMetrics
  suggestions: string[]
  warnings: string[]
  strengths: string[]
}

export class ContentQualityAnalyzer {
  private static instance: ContentQualityAnalyzer

  static getInstance(): ContentQualityAnalyzer {
    if (!ContentQualityAnalyzer.instance) {
      ContentQualityAnalyzer.instance = new ContentQualityAnalyzer()
    }
    return ContentQualityAnalyzer.instance
  }

  analyzeContent(content: string, contentType: string, topic: string): QualityAnalysis {
    const readability = this.analyzeReadability(content)
    const structure = this.analyzeStructure(content, contentType)
    const engagement = this.analyzeEngagement(content, contentType)
    const seo = this.analyzeSEO(content, topic)
    const originality = this.analyzeOriginality(content)
    const factualAccuracy = this.analyzeFactualAccuracy(content)

    const overall = this.calculateOverallScore({
      readability,
      structure,
      engagement,
      seo,
      originality,
      factualAccuracy,
    })

    const suggestions = this.generateSuggestions({
      readability,
      structure,
      engagement,
      seo,
      originality,
      factualAccuracy,
    })

    const warnings = this.generateWarnings(content)
    const strengths = this.identifyStrengths({
      readability,
      structure,
      engagement,
      seo,
      originality,
      factualAccuracy,
    })

    return {
      score: {
        overall,
        readability,
        structure,
        engagement,
        seo,
        originality,
        factualAccuracy,
      },
      suggestions,
      warnings,
      strengths,
    }
  }

  private analyzeReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const words = content.split(/\s+/).filter((w) => w.length > 0)
    const syllables = this.countSyllables(content)

    // Flesch Reading Ease (adapted for Indonesian)
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length

    let score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord

    // Normalize to 0-10 scale
    score = Math.max(0, Math.min(100, score))
    return Math.round((score / 10) * 10) / 10
  }

  private analyzeStructure(content: string, contentType: string): number {
    let score = 0
    const lines = content.split("\n").filter((line) => line.trim().length > 0)

    // Check for proper structure based on content type
    switch (contentType) {
      case "artikel":
        score += this.checkArticleStructure(content)
        break
      case "tugas-sekolah":
        score += this.checkEssayStructure(content)
        break
      case "caption-ig":
        score += this.checkCaptionStructure(content)
        break
      case "email-formal":
        score += this.checkEmailStructure(content)
        break
      default:
        score = 7 // Default score
    }

    return Math.min(10, score)
  }

  private analyzeEngagement(content: string, contentType: string): number {
    let score = 5 // Base score

    // Check for engaging elements
    const hasQuestions = /\?/.test(content)
    const hasCallToAction = /\b(klik|baca|lihat|coba|download|daftar|ikuti)\b/i.test(content)
    const hasEmotionalWords = /\b(amazing|luar biasa|fantastis|menakjubkan|hebat|keren)\b/i.test(content)
    const hasNumbers = /\d+/.test(content)
    const hasListFormat = /^\d+\.|^-|^\*/.test(content)

    if (hasQuestions) score += 1
    if (hasCallToAction) score += 1.5
    if (hasEmotionalWords) score += 1
    if (hasNumbers) score += 0.5
    if (hasListFormat) score += 1

    // Content type specific engagement
    if (contentType === "caption-ig") {
      const hasHashtags = /#\w+/.test(content)
      const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(
        content,
      )
      if (hasHashtags) score += 1
      if (hasEmojis) score += 0.5
    }

    return Math.min(10, score)
  }

  private analyzeSEO(content: string, topic: string): number {
    let score = 5 // Base score
    const topicWords = topic.toLowerCase().split(" ")
    const contentLower = content.toLowerCase()

    // Keyword density check
    let keywordCount = 0
    topicWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g")
      const matches = contentLower.match(regex)
      if (matches) keywordCount += matches.length
    })

    const wordCount = content.split(/\s+/).length
    const keywordDensity = (keywordCount / wordCount) * 100

    // Optimal keyword density: 1-3%
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      score += 2
    } else if (keywordDensity > 0.5 && keywordDensity < 5) {
      score += 1
    }

    // Check for headings (if content has proper structure)
    const hasHeadings = /^#{1,6}\s/.test(content) || /^\d+\./.test(content)
    if (hasHeadings) score += 1

    // Check content length
    if (wordCount >= 300 && wordCount <= 2000) {
      score += 1
    }

    return Math.min(10, score)
  }

  private analyzeOriginality(content: string): number {
    // Basic originality check (in real app, you'd use external API)
    let score = 8 // Assume good originality by default

    // Check for common phrases that might indicate low originality
    const commonPhrases = [
      "dalam era globalisasi",
      "di zaman modern ini",
      "tidak dapat dipungkiri",
      "sebagaimana kita ketahui",
    ]

    let commonPhraseCount = 0
    commonPhrases.forEach((phrase) => {
      if (content.toLowerCase().includes(phrase)) {
        commonPhraseCount++
      }
    })

    score -= commonPhraseCount * 0.5

    return Math.max(5, score) // Minimum score of 5
  }

  private analyzeFactualAccuracy(content: string): number {
    let score = 7 // Base score assuming reasonable accuracy

    // Check for potential red flags
    const redFlags = [
      /\d{4}%/, // Suspiciously precise percentages
      /menurut penelitian terbaru/i, // Vague research claims
      /para ahli mengatakan/i, // Vague expert claims
      /studi menunjukkan/i, // Vague study claims
    ]

    let redFlagCount = 0
    redFlags.forEach((flag) => {
      if (flag.test(content)) {
        redFlagCount++
      }
    })

    score -= redFlagCount * 1

    // Check for balanced language
    const hasBalancedLanguage = /\b(namun|tetapi|meskipun|walaupun)\b/i.test(content)
    if (hasBalancedLanguage) score += 1

    return Math.max(4, Math.min(10, score))
  }

  private calculateOverallScore(metrics: Omit<QualityMetrics, "overall">): number {
    const weights = {
      readability: 0.15,
      structure: 0.25,
      engagement: 0.2,
      seo: 0.15,
      originality: 0.15,
      factualAccuracy: 0.1,
    }

    const weightedSum = Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + metrics[key as keyof typeof metrics] * weight
    }, 0)

    return Math.round(weightedSum * 10) / 10
  }

  private generateSuggestions(metrics: Omit<QualityMetrics, "overall">): string[] {
    const suggestions: string[] = []

    if (metrics.readability < 6) {
      suggestions.push("Gunakan kalimat yang lebih pendek dan sederhana")
      suggestions.push("Hindari kata-kata teknis yang sulit dipahami")
    }

    if (metrics.structure < 7) {
      suggestions.push("Tambahkan heading dan subheading untuk struktur yang lebih jelas")
      suggestions.push("Gunakan paragraf yang lebih pendek (3-4 kalimat)")
    }

    if (metrics.engagement < 6) {
      suggestions.push("Tambahkan pertanyaan untuk melibatkan pembaca")
      suggestions.push("Gunakan call-to-action yang jelas")
      suggestions.push("Sertakan contoh atau cerita untuk menarik perhatian")
    }

    if (metrics.seo < 6) {
      suggestions.push("Gunakan kata kunci topik lebih sering (1-3% dari total kata)")
      suggestions.push("Tambahkan heading dengan kata kunci")
    }

    if (metrics.originality < 7) {
      suggestions.push("Hindari frasa klise yang terlalu umum")
      suggestions.push("Tambahkan perspektif atau insight yang unik")
    }

    if (metrics.factualAccuracy < 7) {
      suggestions.push("Verifikasi data dan statistik yang disebutkan")
      suggestions.push("Gunakan sumber yang dapat dipercaya")
      suggestions.push("Tambahkan disclaimer jika diperlukan")
    }

    return suggestions
  }

  private generateWarnings(content: string): string[] {
    const warnings: string[] = []

    // Check for potential issues
    if (content.length < 100) {
      warnings.push("Konten terlalu pendek, pertimbangkan untuk menambah detail")
    }

    if (content.length > 3000) {
      warnings.push("Konten sangat panjang, pertimbangkan untuk membagi menjadi beberapa bagian")
    }

    // Check for repetitive content
    const sentences = content.split(/[.!?]+/)
    const uniqueSentences = new Set(sentences.map((s) => s.trim().toLowerCase()))
    if (sentences.length - uniqueSentences.size > 2) {
      warnings.push("Terdeteksi kalimat yang berulang, periksa kembali konten")
    }

    // Check for potential bias
    const biasWords = ["selalu", "tidak pernah", "semua orang", "tidak ada yang"]
    const hasBias = biasWords.some((word) => content.toLowerCase().includes(word))
    if (hasBias) {
      warnings.push("Hindari generalisasi yang terlalu luas")
    }

    return warnings
  }

  private identifyStrengths(metrics: Omit<QualityMetrics, "overall">): string[] {
    const strengths: string[] = []

    if (metrics.readability >= 8) {
      strengths.push("Konten mudah dibaca dan dipahami")
    }

    if (metrics.structure >= 8) {
      strengths.push("Struktur konten sangat baik dan terorganisir")
    }

    if (metrics.engagement >= 8) {
      strengths.push("Konten sangat engaging dan menarik")
    }

    if (metrics.seo >= 8) {
      strengths.push("Optimasi SEO sangat baik")
    }

    if (metrics.originality >= 8) {
      strengths.push("Konten original dan unik")
    }

    if (metrics.factualAccuracy >= 8) {
      strengths.push("Konten tampak akurat dan dapat dipercaya")
    }

    return strengths
  }

  // Helper methods
  private countSyllables(text: string): number {
    // Simple syllable counting for Indonesian
    const vowels = "aeiouAEIOU"
    let count = 0
    let previousWasVowel = false

    for (let i = 0; i < text.length; i++) {
      const isVowel = vowels.includes(text[i])
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }

    return Math.max(1, count) // At least 1 syllable per word
  }

  private checkArticleStructure(content: string): number {
    let score = 5

    // Check for introduction
    if (
      (content.length > 200 && content.substring(0, 200).includes("pengantar")) ||
      content.substring(0, 200).includes("pendahuluan")
    ) {
      score += 1
    }

    // Check for conclusion
    if (content.toLowerCase().includes("kesimpulan") || content.toLowerCase().includes("penutup")) {
      score += 1
    }

    // Check for paragraphs
    const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0)
    if (paragraphs.length >= 3) {
      score += 1
    }

    return score
  }

  private checkEssayStructure(content: string): number {
    let score = 5

    // Check for thesis statement
    if (content.toLowerCase().includes("thesis") || content.toLowerCase().includes("argumen utama")) {
      score += 1
    }

    // Check for supporting arguments
    const hasNumberedPoints = /^\d+\./.test(content)
    const hasBulletPoints = /^[-*]/.test(content)
    if (hasNumberedPoints || hasBulletPoints) {
      score += 1
    }

    return score
  }

  private checkCaptionStructure(content: string): number {
    let score = 5

    // Check for hook
    const firstLine = content.split("\n")[0]
    if (firstLine && (firstLine.includes("?") || firstLine.length < 50)) {
      score += 1
    }

    // Check for hashtags
    if (content.includes("#")) {
      score += 1
    }

    return score
  }

  private checkEmailStructure(content: string): number {
    let score = 5

    // Check for greeting
    if (
      content.toLowerCase().includes("dear") ||
      content.toLowerCase().includes("kepada") ||
      content.toLowerCase().includes("halo")
    ) {
      score += 1
    }

    // Check for closing
    if (content.toLowerCase().includes("hormat") || content.toLowerCase().includes("terima kasih")) {
      score += 1
    }

    return score
  }
}

export const contentQualityAnalyzer = ContentQualityAnalyzer.getInstance()
