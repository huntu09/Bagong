import { handleError, sanitizeInput, validateInput } from "../../app/utils/error-handler"

describe("Error Handler Utils", () => {
  describe("handleError", () => {
    it("should return error message for Error objects", () => {
      const error = new Error("Test error message")
      const result = handleError(error)
      expect(result).toBe("Test error message")
    })

    it("should return string errors as-is", () => {
      const error = "String error message"
      const result = handleError(error)
      expect(result).toBe("String error message")
    })

    it("should return fallback message for unknown errors", () => {
      const error = { unknown: "object" }
      const result = handleError(error, "Fallback message")
      expect(result).toBe("Fallback message")
    })

    it("should use default fallback message", () => {
      const error = null
      const result = handleError(error)
      expect(result).toBe("Terjadi kesalahan")
    })
  })

  describe("sanitizeInput", () => {
    it("should remove script tags", () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeInput(input)
      expect(result).toBe("Hello")
    })

    it("should remove HTML tags", () => {
      const input = "<div>Hello <span>World</span></div>"
      const result = sanitizeInput(input)
      expect(result).toBe("Hello World")
    })

    it("should remove javascript: protocols", () => {
      const input = 'javascript:alert("xss")'
      const result = sanitizeInput(input)
      expect(result).toBe('alert("xss")')
    })

    it("should remove event handlers", () => {
      const input = 'onclick="alert()" Hello'
      const result = sanitizeInput(input)
      expect(result).toBe("Hello")
    })

    it("should trim whitespace", () => {
      const input = "  Hello World  "
      const result = sanitizeInput(input)
      expect(result).toBe("Hello World")
    })
  })

  describe("validateInput", () => {
    it("should validate empty input", () => {
      const result = validateInput("")
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Input tidak boleh kosong")
    })

    it("should validate input length", () => {
      const longInput = "a".repeat(1001)
      const result = validateInput(longInput)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Input tidak boleh lebih dari 1000 karakter")
    })

    it("should detect suspicious patterns", () => {
      const maliciousInput = '<script>alert("xss")</script>'
      const result = validateInput(maliciousInput)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Input mengandung karakter yang tidak diizinkan")
    })

    it("should validate clean input", () => {
      const cleanInput = "This is a clean input"
      const result = validateInput(cleanInput)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it("should respect custom max length", () => {
      const input = "Hello World"
      const result = validateInput(input, 5)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe("Input tidak boleh lebih dari 5 karakter")
    })
  })
})
