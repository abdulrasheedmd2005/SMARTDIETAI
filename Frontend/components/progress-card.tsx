'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressCardProps {
  current: number
  goal: number
}

export function ProgressCard({ current, goal }: ProgressCardProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const remaining = Math.max(goal - current, 0)
  
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Daily Calorie Goal</h3>
          <p className="mt-1 text-2xl font-semibold text-card-foreground">
            {current.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">/ {goal} kcal</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-lg font-semibold text-primary">{remaining.toFixed(0)} kcal</p>
        </div>
      </div>
      <Progress value={percentage} className="mt-4 h-3" />
      <p className="mt-2 text-xs text-muted-foreground">{percentage.toFixed(1)}% of daily goal</p>
    </div>
  )
}
