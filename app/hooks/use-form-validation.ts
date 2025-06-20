"use client"

import { useState, useCallback } from "react"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface FormValidationConfig {
  fields: ValidationRules
}

export interface FormValidationReturn {
  values: Record<string, string>
  errors: Record<string, string>
  setValue: (field: string, value: string) => void
  setError: (field: string, error: string) => void
  clearError: (field: string) => void
  getError: (field: string) => string
  getValues: () => Record<string, string>
  validateField: (field: string) => boolean
  validateForm: () => boolean
  reset: () => void
}

export function useFormValidation(config: FormValidationConfig): FormValidationReturn {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setValue = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    },
    [errors],
  )

  const setError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const getError = useCallback(
    (field: string) => {
      return errors[field] || ""
    },
    [errors],
  )

  const getValues = useCallback(() => {
    return { ...values }
  }, [values])

  const validateField = useCallback(
    (field: string): boolean => {
      const rule = config.fields[field]
      const value = values[field] || ""

      if (!rule) return true

      // Required validation
      if (rule.required && !value.trim()) {
        setError(field, "Field ini wajib diisi")
        return false
      }

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        setError(field, `Minimal ${rule.minLength} karakter`)
        return false
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        setError(field, `Maksimal ${rule.maxLength} karakter`)
        return false
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        setError(field, "Format tidak valid")
        return false
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) {
          setError(field, customError)
          return false
        }
      }

      clearError(field)
      return true
    },
    [config.fields, values, setError, clearError],
  )

  const validateForm = useCallback((): boolean => {
    let isValid = true

    Object.keys(config.fields).forEach((field) => {
      if (!validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }, [config.fields, validateField])

  const reset = useCallback(() => {
    setValues({})
    setErrors({})
  }, [])

  return {
    values,
    errors,
    setValue,
    setError,
    clearError,
    getError,
    getValues,
    validateField,
    validateForm,
    reset,
  }
}
