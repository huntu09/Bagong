export const CONTENT_TYPES = [
  { value: "artikel", label: "Artikel" },
  { value: "tugas-sekolah", label: "Tugas Sekolah" },
  { value: "ringkasan-buku", label: "Ringkasan Buku" },
  { value: "caption-ig", label: "Caption IG" },
  { value: "email-formal", label: "Email Formal" },
] as const

export const WRITING_STYLES = [
  { value: "formal", label: "Formal" },
  { value: "santai", label: "Santai" },
  { value: "panjang", label: "Panjang" },
  { value: "pendek", label: "Pendek" },
] as const

export const UI_CONSTANTS = {
  TYPING_SPEED: 20, // milliseconds
  INPUT_LIMITS: {
    TOPIC_MAX_LENGTH: 200,
    CONTENT_MAX_LENGTH: 5000,
  },
  ANIMATION_DELAYS: {
    FADE_IN: 100,
    SLIDE_UP: 200,
    SLIDE_LEFT: 300,
  },
} as const

export const ERROR_MESSAGES = {
  SAVE_FAILED: "Gagal menyimpan konten",
  COPY_FAILED: "Gagal menyalin konten",
  DELETE_FAILED: "Gagal menghapus konten",
  GENERATE_FAILED: "Gagal generate konten",
  VALIDATION_FAILED: "Mohon lengkapi semua field yang diperlukan",
  NETWORK_ERROR: "Terjadi kesalahan jaringan",
  RATE_LIMIT_EXCEEDED: "Terlalu banyak permintaan, coba lagi nanti",
} as const

export const SUCCESS_MESSAGES = {
  CONTENT_SAVED: "Konten berhasil disimpan!",
  CONTENT_COPIED: "Konten berhasil disalin!",
  CONTENT_DELETED: "Konten berhasil dihapus!",
  CONTENT_GENERATED: "Konten berhasil dibuat!",
} as const

export const STORAGE_KEYS = {
  SAVED_CONTENTS: "ai-writer-saved-contents",
  USER_PREFERENCES: "ai-writer-preferences",
  ONBOARDING_STATUS: "ai-writer-onboarding",
} as const

export const API_ENDPOINTS = {
  GENERATE_CONTENT: "/api/generate-content",
  SAVE_CONTENT: "/api/save-content",
  GET_TEMPLATES: "/api/templates",
  ANALYTICS: "/api/analytics",
} as const

export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 10,
  REQUESTS_PER_HOUR: 100,
  REQUESTS_PER_DAY: 500,
} as const
