import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: number
  unit: string
  icon: React.ReactNode
  color: 'emerald' | 'amber' | 'blue' | 'red' | 'violet' | 'cyan' | 'orange'
  goal?: number
}

const colorClasses = {
  emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
  blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
  red: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
  violet: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400',
  cyan: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
  orange: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
}

export function MetricCard({ title, value, unit, icon, color, goal }: MetricCardProps) {
  const percentage = goal ? Math.min((value / goal) * 100, 100) : 0
  
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-card-foreground">
            {value.toFixed(0)}<span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
      
      {goal && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-medium text-card-foreground">{goal} {unit}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-300',
                percentage >= 100 ? 'bg-red-500' : 'bg-emerald-500'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {percentage > 100 
              ? `+${(value - goal).toFixed(0)} over` 
              : `${(goal - value).toFixed(0)} remaining`}
          </p>
        </div>
      )}
    </div>
  )
}

