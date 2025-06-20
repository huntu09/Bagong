"use client"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Toast } from "../../app/components/toast"
import jest from "jest" // Import jest to declare the variable

describe("Toast Component", () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render success toast with correct styling", () => {
    render(<Toast message="Success message" type="success" onClose={mockOnClose} />)

    const toast = screen.getByRole("alert")
    expect(toast).toBeInTheDocument()
    expect(toast).toHaveClass("bg-green-500")
    expect(screen.getByText("Success message")).toBeInTheDocument()
  })

  it("should render error toast with correct styling", () => {
    render(<Toast message="Error message" type="error" onClose={mockOnClose} />)

    const toast = screen.getByRole("alert")
    expect(toast).toHaveClass("bg-red-500")
  })

  it("should render warning toast with correct styling", () => {
    render(<Toast message="Warning message" type="warning" onClose={mockOnClose} />)

    const toast = screen.getByRole("alert")
    expect(toast).toHaveClass("bg-yellow-500")
  })

  it("should render info toast with correct styling", () => {
    render(<Toast message="Info message" type="info" onClose={mockOnClose} />)

    const toast = screen.getByRole("alert")
    expect(toast).toHaveClass("bg-blue-500")
  })

  it("should call onClose when close button is clicked", () => {
    render(<Toast message="Test message" type="info" onClose={mockOnClose} />)

    const closeButton = screen.getByLabelText("Tutup notifikasi")
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it("should auto-close after specified duration", async () => {
    render(<Toast message="Test message" type="info" onClose={mockOnClose} duration={1000} />)

    await waitFor(
      () => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      },
      { timeout: 1500 },
    )
  })

  it("should have proper accessibility attributes", () => {
    render(<Toast message="Accessible message" type="info" onClose={mockOnClose} />)

    const toast = screen.getByRole("alert")
    expect(toast).toHaveAttribute("aria-live", "polite")
    expect(toast).toHaveAttribute("aria-atomic", "true")
  })
})
