interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

interface UserAction {
  action: string
  timestamp: number
  duration?: number
  success: boolean
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private userActions: UserAction[] = []
  private maxEntries = 1000

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Core Web Vitals monitoring
  measureCoreWebVitals(): void {
    if (typeof window === "undefined") return

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric("lcp", lastEntry.startTime, { type: "core-web-vital" })
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric("fid", entry.processingStart - entry.startTime, {
          type: "core-web-vital",
        })
      })
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.recordMetric("cls", clsValue, { type: "core-web-vital" })
    }).observe({ entryTypes: ["layout-shift"] })
  }

  // Custom performance measurements
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    }

    this.metrics.push(metric)
    if (this.metrics.length > this.maxEntries) {
      this.metrics.shift()
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      this.sendMetricToAnalytics(metric)
    }
  }

  // User action tracking
  trackUserAction(action: string, metadata?: Record<string, any>): () => void {
    const startTime = Date.now()

    return (success = true) => {
      const userAction: UserAction = {
        action,
        timestamp: startTime,
        duration: Date.now() - startTime,
        success,
        metadata,
      }

      this.userActions.push(userAction)
      if (this.userActions.length > this.maxEntries) {
        this.userActions.shift()
      }

      // Send to analytics
      if (process.env.NODE_ENV === "production") {
        this.sendActionToAnalytics(userAction)
      }
    }
  }

  // API response time monitoring
  async monitorApiCall<T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> {
    const startTime = performance.now()

    try {
      const result = await apiCall()
      const duration = performance.now() - startTime

      this.recordMetric("api_response_time", duration, {
        endpoint,
        status: "success",
      })

      return result
    } catch (error) {
      const duration = performance.now() - startTime

      this.recordMetric("api_response_time", duration, {
        endpoint,
        status: "error",
      })

      throw error
    }
  }

  // Memory usage monitoring
  monitorMemoryUsage(): void {
    if (typeof window === "undefined" || !("memory" in performance)) return

    const memory = (performance as any).memory
    this.recordMetric("memory_used", memory.usedJSHeapSize, { type: "memory" })
    this.recordMetric("memory_total", memory.totalJSHeapSize, { type: "memory" })
    this.recordMetric("memory_limit", memory.jsHeapSizeLimit, { type: "memory" })
  }

  // Network monitoring
  monitorNetworkStatus(): void {
    if (typeof window === "undefined" || !("navigator" in window)) return

    const connection = (navigator as any).connection
    if (connection) {
      this.recordMetric("network_downlink", connection.downlink, { type: "network" })
      this.recordMetric("network_rtt", connection.rtt, { type: "network" })
    }
  }

  private async sendMetricToAnalytics(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch("/api/analytics/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
      })
    } catch (error) {
      console.warn("Failed to send metric to analytics:", error)
    }
  }

  private async sendActionToAnalytics(action: UserAction): Promise<void> {
    try {
      await fetch("/api/analytics/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      })
    } catch (error) {
      console.warn("Failed to send action to analytics:", error)
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((metric) => metric.name === name)
    }
    return this.metrics
  }

  getUserActions(action?: string): UserAction[] {
    if (action) {
      return this.userActions.filter((ua) => ua.action === action)
    }
    return this.userActions
  }

  // Generate performance report
  generateReport(): {
    coreWebVitals: Record<string, number>
    apiPerformance: Record<string, { avg: number; count: number }>
    userEngagement: Record<string, number>
    memoryUsage: Record<string, number>
  } {
    const report = {
      coreWebVitals: {} as Record<string, number>,
      apiPerformance: {} as Record<string, { avg: number; count: number }>,
      userEngagement: {} as Record<string, number>,
      memoryUsage: {} as Record<string, number>,
    }

    // Core Web Vitals
    const coreVitals = this.metrics.filter((m) => m.tags?.type === "core-web-vital")
    coreVitals.forEach((metric) => {
      report.coreWebVitals[metric.name] = metric.value
    })

    // API Performance
    const apiMetrics = this.metrics.filter((m) => m.name === "api_response_time")
    const apiGroups = apiMetrics.reduce(
      (acc, metric) => {
        const endpoint = metric.tags?.endpoint || "unknown"
        if (!acc[endpoint]) acc[endpoint] = []
        acc[endpoint].push(metric.value)
        return acc
      },
      {} as Record<string, number[]>,
    )

    Object.entries(apiGroups).forEach(([endpoint, values]) => {
      report.apiPerformance[endpoint] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
      }
    })

    // User Engagement
    const actionCounts = this.userActions.reduce(
      (acc, action) => {
        acc[action.action] = (acc[action.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    report.userEngagement = actionCounts

    // Memory Usage
    const memoryMetrics = this.metrics.filter((m) => m.tags?.type === "memory")
    memoryMetrics.forEach((metric) => {
      report.memoryUsage[metric.name] = metric.value
    })

    return report
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()

// Auto-start monitoring in browser
if (typeof window !== "undefined") {
  performanceMonitor.measureCoreWebVitals()

  // Monitor memory every 30 seconds
  setInterval(() => {
    performanceMonitor.monitorMemoryUsage()
    performanceMonitor.monitorNetworkStatus()
  }, 30000)
}
