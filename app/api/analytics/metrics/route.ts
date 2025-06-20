import { type NextRequest, NextResponse } from "next/server"
import { rateLimiter, RATE_LIMITS } from "../../../lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = rateLimiter.checkRateLimit(request, RATE_LIMITS.GENERAL_API)

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const metric = await request.json()

    // Validate metric structure
    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ error: "Invalid metric structure" }, { status: 400 })
    }

    // In production, send to analytics service
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.
    console.log("Metric recorded:", {
      name: metric.name,
      value: metric.value,
      timestamp: new Date(metric.timestamp).toISOString(),
      tags: metric.tags,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to process metric:", error)
    return NextResponse.json({ error: "Failed to process metric" }, { status: 500 })
  }
}
