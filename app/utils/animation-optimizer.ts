// Animation Performance Optimizer
export class AnimationOptimizer {
  private static instance: AnimationOptimizer
  private animationQueue: Array<() => void> = []
  private isProcessing = false
  private rafId: number | null = null

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer()
    }
    return AnimationOptimizer.instance
  }

  // Queue animation for next frame
  queueAnimation(callback: () => void) {
    this.animationQueue.push(callback)
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  private processQueue() {
    if (this.animationQueue.length === 0) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true
    this.rafId = requestAnimationFrame(() => {
      const callback = this.animationQueue.shift()
      if (callback) {
        callback()
      }
      this.processQueue()
    })
  }

  // Cancel all pending animations
  cancelAnimations() {
    this.animationQueue = []
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.isProcessing = false
  }

  // Debounce animations to prevent excessive triggering
  debounceAnimation(key: string, callback: () => void, delay = 100) {
    const timeoutKey = `timeout_${key}`

    // Clear existing timeout
    if ((window as any)[timeoutKey]) {
      clearTimeout((window as any)[timeoutKey])
    }
    // Set new timeout
    ;(window as any)[timeoutKey] = setTimeout(() => {
      this.queueAnimation(callback)
      delete (window as any)[timeoutKey]
    }, delay)
  }

  // Check if user prefers reduced motion
  static prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  // Get optimized animation duration based on user preference
  static getAnimationDuration(defaultDuration: number): number {
    return this.prefersReducedMotion() ? 0 : defaultDuration
  }

  // Create CSS animation with performance optimizations
  static createOptimizedAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ): Animation | null {
    if (this.prefersReducedMotion()) {
      return null
    }

    // Optimize options for performance
    const optimizedOptions: KeyframeAnimationOptions = {
      ...options,
      duration: this.getAnimationDuration((options.duration as number) || 300),
      easing: options.easing || "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design easing
    }

    return element.animate(keyframes, optimizedOptions)
  }
}

// CSS Animation Classes with Performance Optimizations
export const optimizedAnimations = `
  /* Base animation setup with performance optimizations */
  .animate-optimized {
    will-change: transform, opacity;
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Fade animations */
  @keyframes fade-in-optimized {
    from { 
      opacity: 0; 
      transform: translateZ(0);
    }
    to { 
      opacity: 1; 
      transform: translateZ(0);
    }
  }

  @keyframes fade-out-optimized {
    from { 
      opacity: 1; 
      transform: translateZ(0);
    }
    to { 
      opacity: 0; 
      transform: translateZ(0);
    }
  }

  /* Slide animations with GPU acceleration */
  @keyframes slide-in-up-optimized {
    from { 
      opacity: 0; 
      transform: translate3d(0, 20px, 0);
    }
    to { 
      opacity: 1; 
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slide-in-down-optimized {
    from { 
      opacity: 0; 
      transform: translate3d(0, -20px, 0);
    }
    to { 
      opacity: 1; 
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slide-in-left-optimized {
    from { 
      opacity: 0; 
      transform: translate3d(-20px, 0, 0);
    }
    to { 
      opacity: 1; 
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slide-in-right-optimized {
    from { 
      opacity: 0; 
      transform: translate3d(20px, 0, 0);
    }
    to { 
      opacity: 1; 
      transform: translate3d(0, 0, 0);
    }
  }

  /* Scale animations */
  @keyframes scale-in-optimized {
    from { 
      opacity: 0; 
      transform: scale3d(0.9, 0.9, 1);
    }
    to { 
      opacity: 1; 
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes bounce-in-optimized {
    0% { 
      opacity: 0; 
      transform: scale3d(0.3, 0.3, 1);
    }
    50% { 
      opacity: 1; 
      transform: scale3d(1.05, 1.05, 1);
    }
    70% { 
      transform: scale3d(0.9, 0.9, 1);
    }
    100% { 
      opacity: 1; 
      transform: scale3d(1, 1, 1);
    }
  }

  /* Rotation animations */
  @keyframes spin-optimized {
    from { 
      transform: rotate(0deg);
    }
    to { 
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-optimized {
    0%, 100% { 
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
    50% { 
      opacity: 0.8;
      transform: scale3d(1.05, 1.05, 1);
    }
  }

  /* Animation classes */
  .animate-fade-in-optimized {
    animation: fade-in-optimized 0.3s ease-out both;
  }

  .animate-fade-out-optimized {
    animation: fade-out-optimized 0.3s ease-out both;
  }

  .animate-slide-in-up-optimized {
    animation: slide-in-up-optimized 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-slide-in-down-optimized {
    animation: slide-in-down-optimized 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-slide-in-left-optimized {
    animation: slide-in-left-optimized 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-slide-in-right-optimized {
    animation: slide-in-right-optimized 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-scale-in-optimized {
    animation: scale-in-optimized 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-bounce-in-optimized {
    animation: bounce-in-optimized 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .animate-spin-optimized {
    animation: spin-optimized 1s linear infinite;
  }

  .animate-pulse-optimized {
    animation: pulse-optimized 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Stagger animations for lists */
  .animate-stagger > * {
    animation-delay: calc(var(--stagger-delay, 0.1s) * var(--stagger-index, 0));
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .animate-optimized,
    .animate-fade-in-optimized,
    .animate-fade-out-optimized,
    .animate-slide-in-up-optimized,
    .animate-slide-in-down-optimized,
    .animate-slide-in-left-optimized,
    .animate-slide-in-right-optimized,
    .animate-scale-in-optimized,
    .animate-bounce-in-optimized,
    .animate-spin-optimized,
    .animate-pulse-optimized {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Performance optimizations */
  .animate-optimized * {
    transform-style: preserve-3d;
  }

  /* Hover animations with performance */
  .hover-lift {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-2px) translateZ(0);
  }

  .hover-scale {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-scale:hover {
    transform: scale(1.05) translateZ(0);
  }
`

// React hook for optimized animations
export function useOptimizedAnimation() {
  const animator = AnimationOptimizer.getInstance()

  const queueAnimation = (callback: () => void) => {
    animator.queueAnimation(callback)
  }

  const debounceAnimation = (key: string, callback: () => void, delay?: number) => {
    animator.debounceAnimation(key, callback, delay)
  }

  const cancelAnimations = () => {
    animator.cancelAnimations()
  }

  const prefersReducedMotion = AnimationOptimizer.prefersReducedMotion()

  const createAnimation = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    return AnimationOptimizer.createOptimizedAnimation(element, keyframes, options)
  }

  return {
    queueAnimation,
    debounceAnimation,
    cancelAnimations,
    prefersReducedMotion,
    createAnimation,
  }
}
