interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, RateLimitEntry> = new Map()

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  private getClientId(request: Request): string {
    // Get multiple identifiers for better fingerprinting
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const clientIp = forwarded?.split(",")[0]?.trim() || realIp || "unknown"

    // Add more fingerprinting data
    const userAgent = request.headers.get("user-agent") || "unknown"
    const acceptLanguage = request.headers.get("accept-language") || "unknown"
    const acceptEncoding = request.headers.get("accept-encoding") || "unknown"

    // Create a more unique fingerprint
    const fingerprint = `${clientIp}-${userAgent.slice(0, 50)}-${acceptLanguage.slice(0, 20)}-${acceptEncoding.slice(0, 20)}`

    // Hash the fingerprint to avoid storing sensitive data
    return this.hashString(fingerprint)
  }

  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  checkRateLimit(
    request: Request,
    config: RateLimitConfig,
  ): {
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
    isWarning?: boolean
  } {
    this.cleanupExpiredEntries()

    const clientId = this.getClientId(request)
    const now = Date.now()
    const windowEnd = now + config.windowMs

    const entry = this.requests.get(clientId)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.requests.set(clientId, {
        count: 1,
        resetTime: windowEnd,
      })

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: windowEnd,
      }
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      }
    }

    // Increment count
    entry.count++
    this.requests.set(clientId, entry)

    // Warning when approaching limit
    const remaining = config.maxRequests - entry.count
    const isWarning = remaining <= Math.floor(config.maxRequests * 0.2) // Warning at 20% remaining

    return {
      allowed: true,
      remaining,
      resetTime: entry.resetTime,
      isWarning,
    }
  }
}

export const rateLimiter = RateLimiter.getInstance()

// Rate limit configurations
export const RATE_LIMITS = {
  GENERATE_CONTENT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  GENERAL_API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // requests per minute
  },
} as const
