'use client'

import { Check, Loader2 } from 'lucide-react'

interface ScanProgressProps {
  currentStep: number
}

const steps = [
  'Uploading Image',
  'Detecting Food',
  'Extracting Nutrition Data',
  'Generating Health Alerts',
  'Saving Results',
]

export function ScanProgress({ currentStep }: ScanProgressProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Analysis Progress</h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                isCompleted
                  ? 'bg-emerald-500 text-emerald-50'
                  : isCurrent
                  ? 'bg-blue-500 text-blue-50 animate-pulse'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  stepNumber
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  isCurrent
                    ? 'text-foreground'
                    : isCompleted
                    ? 'text-muted-foreground line-through'
                    : 'text-muted-foreground'
                }`}>
                  {step}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
