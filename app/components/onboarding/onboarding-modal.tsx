"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useOnboardingContext } from "./onboarding-provider"
import { WelcomeStep } from "./steps/welcome-step"
import { ContentTypesStep } from "./steps/content-types-step"
import { TemplateDemoStep } from "./steps/template-demo-step"
import { AIDemoStep } from "./steps/ai-demo-step"
import { FeaturesStep } from "./steps/features-step"
import { PWAInstallStep } from "./steps/pwa-install-step"
import type { OnboardingStep } from "@/app/hooks/use-onboarding"
import { useEffect, useState } from "react"

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Selamat datang di AI Writer Pro",
    component: WelcomeStep,
  },
  {
    id: "content-types",
    title: "Content Types",
    description: "Pilih jenis konten Anda",
    component: ContentTypesStep,
  },
  {
    id: "template-demo",
    title: "Templates",
    description: "Template cerdas untuk setiap kebutuhan",
    component: TemplateDemoStep,
  },
  {
    id: "ai-demo",
    title: "AI Demo",
    description: "Lihat keajaiban AI bekerja",
    component: AIDemoStep,
  },
  {
    id: "features",
    title: "Features",
    description: "Simpan & bagikan karya Anda",
    component: FeaturesStep,
  },
  {
    id: "pwa-install",
    title: "Install App",
    description: "Install AI Writer Pro",
    component: PWAInstallStep,
  },
]

export function OnboardingModal() {
  const { isActive, currentStep, nextStep, prevStep, skipOnboarding, completeOnboarding } = useOnboardingContext()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Prevent body scroll when onboarding is active on mobile
    if (isActive && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [isActive])

  if (!isActive) return null

  const currentStepData = onboardingSteps[currentStep]
  const StepComponent = currentStepData?.component

  if (!StepComponent) return null

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  // Mobile Full Screen Layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Mobile Header - Fixed */}
        <div className="flex-shrink-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-4 safe-area-top">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">AI Writer Pro</h1>
              <p className="text-xs text-gray-400 truncate">
                {currentStep + 1}/{onboardingSteps.length}: {currentStepData.description}
              </p>
            </div>
            <Button
              onClick={skipOnboarding}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white text-xs px-2 py-1 h-auto"
            >
              Skip
            </Button>
          </div>

          {/* Mobile Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Mobile Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 pb-24">
            <StepComponent
              onNext={nextStep}
              onPrev={prevStep}
              onSkip={skipOnboarding}
              onComplete={completeOnboarding}
              currentStep={currentStep}
              totalSteps={onboardingSteps.length}
              isActive={true}
            />
          </div>
        </div>

        {/* Mobile Step Indicators - Fixed Bottom */}
        <div className="flex-shrink-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4 safe-area-bottom">
          <div className="flex justify-center space-x-1.5">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-blue-500 w-8"
                    : index < currentStep
                      ? "bg-green-500 w-1.5"
                      : "bg-gray-600 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop Layout (unchanged)
  return (
    <Dialog open={isActive} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border border-gray-800 p-0">
        {/* Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">AI Writer Pro Setup</h1>
              <p className="text-sm text-gray-400">
                Step {currentStep + 1} of {onboardingSteps.length}: {currentStepData.description}
              </p>
            </div>
            <Button onClick={skipOnboarding} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              Skip Tutorial
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 pb-8">
          <StepComponent
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={skipOnboarding}
            onComplete={completeOnboarding}
            currentStep={currentStep}
            totalSteps={onboardingSteps.length}
            isActive={true}
          />
        </div>

        {/* Step Indicators */}
        <div className="sticky bottom-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-blue-500 w-8" : index < currentStep ? "bg-green-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
