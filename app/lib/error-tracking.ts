interface ErrorContext {
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  timestamp: number
  severity: "low" | "medium" | "high" | "critical"
  tags?: Record<string, string>
  extra?: Record<string, any>
}

interface ErrorEvent {
  id: string
  message: string
  stack?: string
  context: ErrorContext
  fingerprint: string
}

class ErrorTracker {
  private static instance: ErrorTracker
  private errors: ErrorEvent[] = []
  private maxErrors = 1000 // Keep last 1000 errors in memory

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  private generateFingerprint(error: Error, context: ErrorContext): string {
    const message = error.message || "Unknown error"
    const stack = error.stack?.split("\n")[0] || ""
    const url = context.url || ""
    return btoa(`${message}-${stack}-${url}`).slice(0, 16)
  }

  private generateSessionId(): string {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("error-tracker-session")
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15)
        sessionStorage.setItem("error-tracker-session", sessionId)
      }
      return sessionId
    }
    return "server-session"
  }

  captureError(error: Error | string, context: Partial<ErrorContext> = {}): string {
    const errorObj = typeof error === "string" ? new Error(error) : error
    const errorId = Math.random().toString(36).substring(2, 15)

    const fullContext: ErrorContext = {
      sessionId: this.generateSessionId(),
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "server",
      url: typeof window !== "undefined" ? window.location.href : "server",
      timestamp: Date.now(),
      severity: "medium",
      ...context,
    }

    const errorEvent: ErrorEvent = {
      id: errorId,
      message: errorObj.message,
      stack: errorObj.stack,
      context: fullContext,
      fingerprint: this.generateFingerprint(errorObj, fullContext),
    }

    // Add to memory store
    this.errors.push(errorEvent)
    if (this.errors.length > this.maxErrors) {
      this.errors.shift() // Remove oldest error
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracked:", errorEvent)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(errorEvent).catch(console.error)
    }

    return errorId
  }

  private async sendToExternalService(errorEvent: ErrorEvent): Promise<void> {
    try {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      const response = await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorEvent),
      })

      if (!response.ok) {
        console.warn("Failed to send error to tracking service")
      }
    } catch (err) {
      console.warn("Error tracking service unavailable:", err)
    }
  }

  getErrors(limit = 50): ErrorEvent[] {
    return this.errors.slice(-limit)
  }

  getErrorsByFingerprint(fingerprint: string): ErrorEvent[] {
    return this.errors.filter((error) => error.fingerprint === fingerprint)
  }

  clearErrors(): void {
    this.errors = []
  }

  // React Error Boundary integration
  captureReactError(error: Error, errorInfo: { componentStack: string }): string {
    return this.captureError(error, {
      severity: "high",
      tags: { type: "react-error" },
      extra: { componentStack: errorInfo.componentStack },
    })
  }
}

export const errorTracker = ErrorTracker.getInstance()

// Global error handlers
if (typeof window !== "undefined") {
  // Capture unhandled JavaScript errors
  window.addEventListener("error", (event) => {
    // Filter out ResizeObserver errors (harmless but noisy)
    if (event.message?.includes("ResizeObserver loop")) {
      return // Ignore this error
    }

    errorTracker.captureError(event.error || new Error(event.message), {
      severity: "high",
      tags: { type: "unhandled-error" },
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    })
  })

  // Capture unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    // Filter out ResizeObserver errors
    if (event.reason?.message?.includes("ResizeObserver loop")) {
      return // Ignore this error
    }

    errorTracker.captureError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
      severity: "high",
      tags: { type: "unhandled-promise" },
      extra: { reason: event.reason },
    })
  })
}
