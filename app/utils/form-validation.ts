export const ValidationRules = {
  contentType: {
    required: true,
    custom: (value: string) => {
      const validTypes = ["artikel", "tugas-sekolah", "ringkasan-buku", "caption-ig", "email"]
      if (!validTypes.includes(value)) {
        return "Pilih tipe konten yang valid"
      }
      return null
    },
  },

  topic: {
    required: true,
    minLength: 3,
    maxLength: 200,
    custom: (value: string) => {
      if (value.trim().length < 3) {
        return "Topik minimal 3 karakter"
      }
      if (!/^[a-zA-Z0-9\s\-.,!?()]+$/.test(value)) {
        return "Topik mengandung karakter yang tidak diizinkan"
      }
      return null
    },
  },

  writingStyle: {
    required: true,
    custom: (value: string) => {
      const validStyles = ["formal", "informal", "akademik", "kreatif", "persuasif"]
      if (!validStyles.includes(value)) {
        return "Pilih gaya penulisan yang valid"
      }
      return null
    },
  },

  template: {
    required: true,
    custom: (value: string) => {
      if (!value || value.trim() === "") {
        return "Pilih template yang sesuai"
      }
      return null
    },
  },
} as const

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/[<>]/g, "") // Remove < and >
    .substring(0, 1000) // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
