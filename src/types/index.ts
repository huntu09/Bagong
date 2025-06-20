import type React from "react"

export interface SavedContent {
  id: string
  title: string
  content: string
  contentType: string
  writingStyle: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt?: string
  metadata: {
    wordCount: number
    readingTime: number
    language: string
  }
  qualityAnalysis: QualityAnalysis
}

export interface GenerationOptions {
  topic: string
  contentType: string
  writingStyle: string
  targetAudience: string
  wordCount: number
  tone: string
  includeKeywords?: string[]
  customInstructions?: string
  template: string
}

export interface GenerationResult {
  content: string
  metadata: {
    wordCount: number
    readingTime: number
    characterCount: number
    paragraphCount: number
  }
  qualityAnalysis: QualityAnalysis
  alternatives?: string[]
}

export interface QualityAnalysis {
  overallScore: number
  readabilityScore: number
  grammarScore: number
  coherenceScore: number
  engagementScore: number
  seoScore: number
  strengths: string[]
  suggestions: string[]
  improvements: string[]
}

export interface AppSettings {
  autoSave: boolean
  darkMode: boolean
  notifications: boolean
  defaultContentType: string
  defaultWritingStyle: string
  maxSavedContents: number
  language: string
  fontSize: number
  onboardingCompleted?: boolean
}

export interface ContentType {
  id: string
  name: string
  icon: string
  description: string
  templates?: Template[]
}

export interface WritingStyle {
  id: string
  name: string
  description: string
}

export interface Template {
  id: string
  name: string
  description: string
  structure: string[]
}

export interface TargetAudience {
  id: string
  name: string
  description: string
}

export interface ToastConfig {
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
}

export interface Statistics {
  totalContents: number
  favoriteContents: number
  contentsByType: { [key: string]: number }
  totalWords: number
  averageQualityScore: number
  mostUsedContentType: string
  generationHistory: {
    date: string
    count: number
  }[]
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  component?: React.ComponentType<any>
}

export interface NavigationProps {
  navigation: any
  route: any
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ErrorInfo {
  message: string
  stack?: string
  timestamp: string
  userId?: string
  action?: string
}

export interface ContentTemplate {
  id: string
  name: string
  description: string
  contentType: string
  structure: string[]
  placeholders: Record<string, string>
  example: string
}

export interface AppSettings {
  defaultContentType: string
  defaultWritingStyle: string
  defaultTargetAudience: string
  defaultWordCount: number
  autoSave: boolean
  showQualityAnalysis: boolean
  theme: "light" | "dark" | "auto"
  language: string
  notifications: {
    enabled: boolean
    contentReady: boolean
    qualityAlerts: boolean
  }
}
