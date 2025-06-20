import { FormValidator, ValidationRules } from "../../app/utils/form-validation"

describe("Form Validation", () => {
  let validator: FormValidator

  beforeEach(() => {
    validator = new FormValidator()
  })

  describe("FormValidator", () => {
    it("should add and validate required fields", () => {
      validator.addField("email", { required: true })
      validator.setValue("email", "")

      const result = validator.validateAll()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("email: Field ini wajib diisi")
    })

    it("should validate minimum length", () => {
      validator.addField("password", { required: true, minLength: 8 })
      validator.setValue("password", "123")

      const result = validator.validateAll()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("password: Minimal 8 karakter")
    })

    it("should validate maximum length", () => {
      validator.addField("username", { required: true, maxLength: 10 })
      validator.setValue("username", "verylongusername")

      const result = validator.validateAll()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("username: Maksimal 10 karakter")
    })

    it("should validate pattern", () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      validator.addField("email", { required: true, pattern: emailPattern })
      validator.setValue("email", "invalid-email")

      const result = validator.validateAll()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("email: Format tidak valid")
    })

    it("should validate custom rules", () => {
      validator.addField("age", {
        required: true,
        custom: (value) => {
          const age = Number.parseInt(value)
          return age < 18 ? "Harus berusia minimal 18 tahun" : null
        },
      })
      validator.setValue("age", "16")

      const result = validator.validateAll()
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("age: Harus berusia minimal 18 tahun")
    })

    it("should pass validation for valid input", () => {
      validator.addField("name", { required: true, minLength: 2, maxLength: 50 })
      validator.setValue("name", "John Doe")

      const result = validator.validateAll()
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reset form state", () => {
      validator.addField("test", { required: true })
      validator.setValue("test", "value")
      validator.reset()

      const field = validator.getField("test")
      expect(field?.value).toBe("")
      expect(field?.touched).toBe(false)
      expect(field?.error).toBe("")
    })
  })

  describe("ValidationRules", () => {
    it("should validate topic rules", () => {
      const validator = new FormValidator()
      validator.addField("topic", ValidationRules.topic)

      // Test too short
      validator.setValue("topic", "ab")
      expect(validator.isFieldValid("topic")).toBe(false)

      // Test invalid characters
      validator.setValue("topic", "test<script>")
      expect(validator.isFieldValid("topic")).toBe(false)

      // Test valid topic
      validator.setValue("topic", "Valid topic about AI")
      expect(validator.isFieldValid("topic")).toBe(true)
    })

    it("should validate content type rules", () => {
      const validator = new FormValidator()
      validator.addField("contentType", ValidationRules.contentType)

      // Test invalid type
      validator.setValue("contentType", "invalid-type")
      expect(validator.isFieldValid("contentType")).toBe(false)

      // Test valid type
      validator.setValue("contentType", "artikel")
      expect(validator.isFieldValid("contentType")).toBe(true)
    })

    it("should validate writing style rules", () => {
      const validator = new FormValidator()
      validator.addField("writingStyle", ValidationRules.writingStyle)

      // Test invalid style
      validator.setValue("writingStyle", "invalid-style")
      expect(validator.isFieldValid("writingStyle")).toBe(false)

      // Test valid style
      validator.setValue("writingStyle", "formal")
      expect(validator.isFieldValid("writingStyle")).toBe(true)
    })
  })
})
