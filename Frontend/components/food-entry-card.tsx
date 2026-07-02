'use client'

import { useState } from 'react'
import { Trash2, Flame, Droplet, Dumbbell, CircleDot, ChevronDown, Wheat, Zap, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HealthAlerts } from '@/components/health-alerts'
import type { FoodEntry } from '@/lib/types'

interface FoodEntryCardProps {
  entry: FoodEntry
  onDelete: (id: string) => void
}

export function FoodEntryCard({ entry, onDelete }: FoodEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const formattedDate = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour:'2-digit',
        minute:'2-digit',
      })
    : "no date"
  
  const formattedTime = entry.created_at    ? new Date(entry.created_at).toLocaleTimeString()
    : null

  return (
    <div className="rounded-xl border border-border bg-card transition-all hover:border-primary/30">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-card-foreground">{entry.food_name}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
           
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      
        {/* Quick Summary */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Flame className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="text-sm font-medium text-card-foreground">{entry.calories}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-wheat-50 dark:bg-amber-950/30">
              <Wheat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="text-sm font-medium text-card-foreground">{entry.carbohydrates || '--'}g</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="text-sm font-medium text-card-foreground">{entry.protein}g</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
              <CircleDot className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="text-sm font-medium text-card-foreground">{entry.fat}g</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border p-5 space-y-4">
          {/* Full Nutrition Summary */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Nutrition Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="text-xs text-muted-foreground">Sugar</span>
                <span className="font-medium text-card-foreground">{entry.sugar}g</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="text-xs text-muted-foreground">Sodium</span>
                <span className="font-medium text-card-foreground">{entry.sodium || '--'}mg</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="text-xs text-muted-foreground">Cholesterol</span>
                <span className="font-medium text-card-foreground">{entry.cholesterol || '--'}mg</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <span className="text-xs text-muted-foreground">Calories</span>
                <span className="font-medium text-card-foreground">{entry.calories}</span>
              </div>
            </div>
          </div>

          {/* Health Alerts */}
          {entry.warnings && entry.warnings.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Dietary Warnings</p>
              <HealthAlerts warnings={entry.warnings} />
            </div>
          )}

          {/* Timestamp */}
          {formattedTime && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">Scanned at</p>
              <p className="font-medium text-card-foreground">{formattedTime}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
