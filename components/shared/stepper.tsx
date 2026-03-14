import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number // 1-based
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-0", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={index} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isActive &&
                    "border-primary bg-background text-primary",
                  !isCompleted &&
                    !isActive &&
                    "border-muted-foreground/30 bg-background text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5 stroke-[2.5]" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium leading-none whitespace-nowrap transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-4 h-px w-14 transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
