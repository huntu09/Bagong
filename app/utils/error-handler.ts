/* -----------------------------------------------
 * app/utils/error-handler.ts
 * Centralised helpers for logging, sanitising, and
 * validating user-supplied strings.
 * --------------------------------------------- */

export function handleError(error: unknown, fallbackMessage = "Terjadi kesalahan"): string {
  // Log once for debugging (this runs only on the server in production)
  console.error("[AI-Writer] Error captured:", error)

  // Never leak sensitive details in production
  const safeFallback = process.env.NODE_ENV === "production" ? fallbackMessage : undefined

  if (error instanceof Error) {
    return safeFallback ?? error.message
  }

  if (typeof error === "string") {
    return safeFallback ?? error
  }

  return fallbackMessage
}

/**
 * Very defensive sanitiser – removes tags / scripts /
 * protocols that can lead to XSS or other injections.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return ""

  return (
    input
      // strip <script>…</script>
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // strip all html tags
      .replace(/<\/?[^>]+(>|$)/g, "")
      // strip dangerous protocols
      .replace(/(?:javascript|vbscript|data):/gi, "")
      // strip in-line event handlers e.g. onclick=
      .replace(/\s*on\w+="[^"]*"/gi, "")
      // collapse whitespace
      .replace(/\s+/g, " ")
      // trim
      .trim()
      // hard cut to avoid DoS with gigantic payloads
      .slice(0, 10_000)
  )
}

/**
 * Basic length & pattern validation for free-text fields.
 */
export function validateInput(input: string, maxLength = 1_000): { isValid: boolean; error?: string } {
  if (!input.trim()) return { isValid: false, error: "Input tidak boleh kosong" }
  if (input.length > maxLength)
    return {
      isValid: false,
      error: `Input tidak boleh lebih dari ${maxLength} karakter`,
    }

  const forbidden = [/<script/i, /<\/script>/i, /(?:javascript|vbscript|data):/i, /\s*on\w+="[^"]*"/i]

  if (forbidden.some((re) => re.test(input))) {
    return { isValid: false, error: "Input mengandung karakter berbahaya" }
  }

  return { isValid: true }
}
