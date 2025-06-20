"use client"

import { renderHook, act } from "@testing-library/react"
import { useToast } from "../../app/hooks/use-toast"

describe("useToast Hook", () => {
  it("should initialize with empty toasts", () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])
  })

  it("should add success toast", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess("Success message")
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe("Success message")
    expect(result.current.toasts[0].type).toBe("success")
  })

  it("should add error toast", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showError("Error message")
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].type).toBe("error")
  })

  it("should add warning toast", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showWarning("Warning message")
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].type).toBe("warning")
  })

  it("should add info toast", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showInfo("Info message")
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].type).toBe("info")
  })

  it("should remove toast by id", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess("Test message")
    })

    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.hideToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it("should handle multiple toasts", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess("Message 1")
      result.current.showError("Message 2")
      result.current.showWarning("Message 3")
    })

    expect(result.current.toasts).toHaveLength(3)
    expect(result.current.toasts[0].message).toBe("Message 1")
    expect(result.current.toasts[1].message).toBe("Message 2")
    expect(result.current.toasts[2].message).toBe("Message 3")
  })

  it("should generate unique IDs for toasts", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.showSuccess("Message 1")
      result.current.showSuccess("Message 2")
    })

    const ids = result.current.toasts.map((toast) => toast.id)
    expect(ids[0]).not.toBe(ids[1])
  })
})
