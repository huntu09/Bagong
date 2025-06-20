export const COLORS = {
  // Primary Colors
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  primaryLight: "#818CF8",

  // Secondary Colors
  secondary: "#EC4899",
  accent: "#10B981",

  // Background Colors
  background: "#0F172A",
  surface: "#1E293B",
  card: "#334155",

  // Text Colors
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#64748B",

  // Status Colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Utility Colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  border: "#475569",
  overlay: "rgba(0, 0, 0, 0.5)",
}

export const CONTENT_TYPES = [
  {
    id: "article",
    name: "Artikel",
    description: "Artikel informatif dan edukatif",
    icon: "article",
    templates: ["news", "tutorial", "review", "opinion"],
  },
  {
    id: "blog",
    name: "Blog Post",
    description: "Konten blog personal atau bisnis",
    icon: "edit",
    templates: ["personal", "business", "lifestyle", "tech"],
  },
  {
    id: "social",
    name: "Social Media",
    description: "Konten untuk media sosial",
    icon: "share",
    templates: ["instagram", "twitter", "facebook", "linkedin"],
  },
  {
    id: "marketing",
    name: "Marketing Copy",
    description: "Konten pemasaran dan promosi",
    icon: "campaign",
    templates: ["sales", "email", "ad", "landing"],
  },
  {
    id: "academic",
    name: "Akademik",
    description: "Konten akademik dan penelitian",
    icon: "school",
    templates: ["essay", "research", "thesis", "report"],
  },
  {
    id: "creative",
    name: "Kreatif",
    description: "Konten kreatif dan storytelling",
    icon: "brush",
    templates: ["story", "poem", "script", "lyrics"],
  },
]

export const WRITING_STYLES = [
  {
    id: "formal",
    name: "Formal",
    description: "Gaya penulisan resmi dan profesional",
  },
  {
    id: "casual",
    name: "Kasual",
    description: "Gaya penulisan santai dan friendly",
  },
  {
    id: "persuasive",
    name: "Persuasif",
    description: "Gaya penulisan yang meyakinkan",
  },
  {
    id: "informative",
    name: "Informatif",
    description: "Gaya penulisan yang memberikan informasi",
  },
  {
    id: "creative",
    name: "Kreatif",
    description: "Gaya penulisan yang imajinatif",
  },
  {
    id: "technical",
    name: "Teknis",
    description: "Gaya penulisan untuk konten teknis",
  },
]

export const TARGET_AUDIENCES = [
  {
    id: "general",
    name: "General Public",
    description: "Masyarakat umum",
  },
  {
    id: "students",
    name: "Pelajar/Mahasiswa",
    description: "Kalangan akademik",
  },
  {
    id: "professionals",
    name: "Profesional",
    description: "Kalangan profesional",
  },
  {
    id: "business",
    name: "Bisnis",
    description: "Pelaku bisnis dan entrepreneur",
  },
  {
    id: "tech",
    name: "Tech Enthusiast",
    description: "Pecinta teknologi",
  },
  {
    id: "youth",
    name: "Anak Muda",
    description: "Generasi muda (18-30 tahun)",
  },
]

export const WORD_COUNT_OPTIONS = [
  {
    value: 250,
    label: "Pendek (250 kata)",
    description: "Cocok untuk social media dan ringkasan",
  },
  {
    value: 500,
    label: "Sedang (500 kata)",
    description: "Cocok untuk blog post dan artikel pendek",
  },
  {
    value: 1000,
    label: "Panjang (1000 kata)",
    description: "Cocok untuk artikel mendalam",
  },
  {
    value: 1500,
    label: "Sangat Panjang (1500 kata)",
    description: "Cocok untuk tutorial dan guide",
  },
  {
    value: 2000,
    label: "Ekstensif (2000+ kata)",
    description: "Cocok untuk whitepaper dan research",
  },
]

export const QUALITY_THRESHOLDS = {
  EXCELLENT: 8.5,
  GOOD: 7.0,
  FAIR: 5.5,
  POOR: 0,
}

export const APP_CONFIG = {
  name: "AI Writer Pro",
  version: "1.0.0",
  description: "Advanced AI Content Generator",
  author: "AI Writer Pro Team",
  website: "https://aiwriterpro.com",
  support: "support@aiwriterpro.com",
}

export const STORAGE_KEYS = {
  SAVED_CONTENTS: "@aiwriterpro_saved_contents",
  APP_SETTINGS: "@aiwriterpro_settings",
  ONBOARDING_COMPLETED: "@aiwriterpro_onboarding",
  USER_PREFERENCES: "@aiwriterpro_preferences",
  TEMPLATES: "@aiwriterpro_templates",
}

export const API_ENDPOINTS = {
  GENERATE_CONTENT: "/api/generate-content",
  ANALYZE_QUALITY: "/api/analyze-quality",
  GET_TEMPLATES: "/api/templates",
  SAVE_CONTENT: "/api/save-content",
}
