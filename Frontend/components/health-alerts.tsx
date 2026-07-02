'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'

interface HealthAlertsProps {
  warnings?: string[]
}

export function HealthAlerts({ warnings }: HealthAlertsProps) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-900 dark:text-green-200">No Dietary Warnings</p>
            <p className="mt-0.5 text-xs text-green-800 dark:text-green-300">This food item is clear for your dietary preferences</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => (
        <div
          key={index}
          className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 flex items-start gap-3"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <span className="font-semibold">Caution:</span> {warning}
          </p>
        </div>
      ))}
    </div>
  )
}
