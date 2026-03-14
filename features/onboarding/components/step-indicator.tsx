interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isComplete = stepNumber < currentStep
        const isActive = stepNumber === currentStep

        return (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isComplete
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'border-primary text-primary border-2 bg-transparent'
                      : 'border-muted-foreground/30 text-muted-foreground border-2 bg-transparent',
                ].join(' ')}
              >
                {isComplete ? (
                  <svg
                    className="size-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8l3.5 3.5 6.5-7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={[
                  'text-xs font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                ].join(' ')}
              >
                {label}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {index < steps.length - 1 && (
              <div
                className={[
                  'mb-5 h-px w-16 transition-colors',
                  isComplete ? 'bg-primary' : 'bg-muted-foreground/20',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
