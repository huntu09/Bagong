import type { QualityAnalysis } from "../types"

export class ContentQualityAnalyzer {
  private static instance: ContentQualityAnalyzer

  static getInstance(): ContentQualityAnalyzer {
    if (!ContentQualityAnalyzer.instance) {
      ContentQualityAnalyzer.instance = new ContentQualityAnalyzer()
    }
    return ContentQualityAnalyzer.instance
  }

  analyzeContent(content: string, contentType: string, topic: string): QualityAnalysis {
    const readabilityScore = this.analyzeReadability(content)
    const engagementScore = this.analyzeEngagement(content, contentType)
    const structureScore = this.analyzeStructure(content, contentType)
    const relevanceScore = this.analyzeRelevance(content, topic)

    const overallScore = (readabilityScore + engagementScore + structureScore + relevanceScore) / 4

    return {
      score: {
        overall: Math.round(overallScore * 10) / 10,
        readability: Math.round(readabilityScore * 10) / 10,
        engagement: Math.round(engagementScore * 10) / 10,
        structure: Math.round(structureScore * 10) / 10,
        relevance: Math.round(relevanceScore * 10) / 10,
      },
      suggestions: this.generateSuggestions(content, contentType),
      strengths: this.identifyStrengths(content, contentType),
      improvements: this.identifyImprovements(content, contentType),
    }
  }

  private analyzeReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const words = content.split(/\s+/).filter((w) => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length

    // Flesch Reading Ease approximation for Indonesian
    let score = 8.5
    if (avgWordsPerSentence > 20) score -= 1.5
    if (avgWordsPerSentence > 25) score -= 1
    if (avgWordsPerSentence < 10) score += 0.5

    // Check for complex words (more than 3 syllables approximation)
    const complexWords = words.filter((word) => word.length > 8).length
    const complexWordRatio = complexWords / words.length
    if (complexWordRatio > 0.15) score -= 1
    if (complexWordRatio < 0.05) score += 0.5

    return Math.max(1, Math.min(10, score))
  }

  private analyzeEngagement(content: string, contentType: string): number {
    let score = 7

    // Check for engaging elements
    const hasQuestions = /\?/.test(content)
    const hasExclamations = /!/.test(content)
    const hasNumbers = /\d+/.test(content)
    const hasBulletPoints = /[•\-*]/.test(content)

    if (hasQuestions) score += 0.5
    if (hasExclamations) score += 0.3
    if (hasNumbers) score += 0.4
    if (hasBulletPoints) score += 0.3

    // Content type specific checks
    if (contentType === "caption-ig") {
      const hasHashtags = /#\w+/.test(content)
      const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(
        content,
      )
      if (hasHashtags) score += 0.5
      if (hasEmojis) score += 0.5
    }

    return Math.max(1, Math.min(10, score))
  }

  private analyzeStructure(content: string, contentType: string): number {
    let score = 7

    // Check for proper structure
    const hasHeadings = /^#+\s/m.test(content) || /^[A-Z][^.!?]*:$/m.test(content)
    const hasParagraphs = content.split("\n\n").length > 2
    const hasIntroConclusion = content.length > 200

    if (hasHeadings) score += 1
    if (hasParagraphs) score += 0.5
    if (hasIntroConclusion) score += 0.5

    // Content type specific structure checks
    switch (contentType) {
      case "artikel":
        if (content.includes("##") || content.includes("###")) score += 0.5
        break
      case "tugas-sekolah":
        if (content.includes("Pendahuluan") && content.includes("Kesimpulan")) score += 1
        break
      case "email-formal":
        if (content.includes("Dengan hormat") || content.includes("Hormat saya")) score += 0.5
        break
    }

    return Math.max(1, Math.min(10, score))
  }

  private analyzeRelevance(content: string, topic: string): number {
    const topicWords = topic.toLowerCase().split(/\s+/)
    const contentLower = content.toLowerCase()

    let relevanceCount = 0
    topicWords.forEach((word) => {
      if (word.length > 3 && contentLower.includes(word)) {
        relevanceCount++
      }
    })

    const relevanceRatio = relevanceCount / topicWords.length
    const score = 5 + relevanceRatio * 5

    return Math.max(1, Math.min(10, score))
  }

  private generateSuggestions(content: string, contentType: string): string[] {
    const suggestions: string[] = []

    const words = content.split(/\s+/).length
    if (words < 100) {
      suggestions.push("Konten terlalu pendek, pertimbangkan untuk menambah detail")
    }

    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const avgWordsPerSentence = words / sentences.length
    if (avgWordsPerSentence > 25) {
      suggestions.push("Kalimat terlalu panjang, pecah menjadi kalimat yang lebih pendek")
    }

    if (!/[.!?]$/.test(content.trim())) {
      suggestions.push("Pastikan konten diakhiri dengan tanda baca yang tepat")
    }

    if (contentType === "caption-ig" && !/#\w+/.test(content)) {
      suggestions.push("Tambahkan hashtag yang relevan untuk meningkatkan reach")
    }

    return suggestions
  }

  private identifyStrengths(content: string, contentType: string): string[] {
    const strengths: string[] = []

    if (/^#+\s/m.test(content)) {
      strengths.push("Struktur heading yang baik")
    }

    if (content.split("\n\n").length > 2) {
      strengths.push("Pembagian paragraf yang jelas")
    }

    if (/\d+/.test(content)) {
      strengths.push("Menggunakan data dan angka")
    }

    const words = content.split(/\s+/).length
    if (words >= 300 && words <= 800) {
      strengths.push("Panjang konten optimal")
    }

    return strengths
  }

  private identifyImprovements(content: string, contentType: string): string[] {
    const improvements: string[] = []

    if (!/\?/.test(content) && contentType !== "email-formal") {
      improvements.push("Tambahkan pertanyaan untuk meningkatkan engagement")
    }

    if (!/[•\-*]/.test(content) && content.length > 300) {
      improvements.push("Gunakan bullet points untuk memudah pembacaan")
    }

    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    if (sentences.length < 3) {
      improvements.push("Tambahkan lebih banyak detail dan penjelasan")
    }

    return improvements
  }
}

export const contentQualityAnalyzer = ContentQualityAnalyzer.getInstance()
