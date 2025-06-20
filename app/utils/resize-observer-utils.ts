"use client"

import type React from "react"

// Utility untuk handle ResizeObserver dengan error handling yang proper
export class SafeResizeObserver {
  private observer: ResizeObserver | null = null
  private callbacks: Map<Element, ResizeObserverCallback> = new Map()

  constructor() {
    if (typeof window !== "undefined" && window.ResizeObserver) {
      this.observer = new ResizeObserver((entries, observer) => {
        // Wrap dalam requestAnimationFrame untuk avoid loop
        requestAnimationFrame(() => {
          try {
            entries.forEach((entry) => {
              const callback = this.callbacks.get(entry.target)
              if (callback) {
                callback([entry], observer)
              }
            })
          } catch (error) {
            // Silently handle ResizeObserver errors
            if (!error.message?.includes("ResizeObserver loop")) {
              console.warn("ResizeObserver error:", error)
            }
          }
        })
      })
    }
  }

  observe(element: Element, callback: ResizeObserverCallback) {
    if (!this.observer) return

    this.callbacks.set(element, callback)

    try {
      this.observer.observe(element)
    } catch (error) {
      console.warn("Failed to observe element:", error)
    }
  }

  unobserve(element: Element) {
    if (!this.observer) return

    this.callbacks.delete(element)

    try {
      this.observer.unobserve(element)
    } catch (error) {
      console.warn("Failed to unobserve element:", error)
    }
  }

  disconnect() {
    if (!this.observer) return

    try {
      this.observer.disconnect()
      this.callbacks.clear()
    } catch (error) {
      console.warn("Failed to disconnect ResizeObserver:", error)
    }
  }
}

// Singleton instance
export const safeResizeObserver = new SafeResizeObserver()

// Hook untuk menggunakan SafeResizeObserver
import { useEffect, useRef } from "react"

export function useSafeResizeObserver<T extends Element>(
  callback: ResizeObserverCallback,
  deps: React.DependencyList = [],
) {
  const elementRef = useRef<T>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    safeResizeObserver.observe(element, callback)

    return () => {
      safeResizeObserver.unobserve(element)
    }
  }, deps)

  return elementRef
}
