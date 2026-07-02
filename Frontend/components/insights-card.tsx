'use client'

import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import type { UserProfile, DailyTotals, FoodEntry } from '@/lib/types'

interface InsightsCardProps {
  profile: UserProfile
  totals: DailyTotals
  entries: FoodEntry[]
}

interface Insight {
  type:  'info'
  message: string
  entries: FoodEntry[]
}


function getInsights(profile: UserProfile, totals: DailyTotals, entries: FoodEntry[]): Insight[] {
  const insights: Insight[] = []

  const mealCount= entries.length
  const highestProteinFood= entries.reduce((a,b) => b.protein > a.protein ? b : a, entries[0] || { protein: 0 })
  const highestSugarFood= entries.reduce((a,b) => b.sugar > a.sugar ? b : a, entries[0] || { sugar: 0 })
 
 

  insights.push({
    type: "info",
    message: `Foods logged: ${mealCount}`,
    entries: []
  })

  

  insights.push({
    type: "info",
    message: `Highest Protein Food: ${highestProteinFood.food_name} `,
    entries: []
  })
  
  insights.push({
    type: "info",
    message: `Highest Sugar Food: ${highestSugarFood.food_name} `,
    entries: []
  })

if (insights.length === 0 && totals.calories === 0) {
    insights.push({
      type: 'info', message: 'Start logging your meals to get personalized insights!',
      entries: []
    })
  }
 
  return insights

}
  

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-chart-1" />,
  warning: <AlertCircle className="h-5 w-5 text-chart-3" />,
  info: <Info className="h-5 w-5 text-chart-2" />,
}

const bgMap = {
  success: 'bg-chart-1/10 border-chart-1/20',
  warning: 'bg-chart-3/10 border-chart-3/20',
  info: 'bg-chart-2/10 border-chart-2/20',
}

export function InsightsCard({ profile, totals, entries }: InsightsCardProps) {
  const insights = getInsights(profile, totals, entries)

  
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground">Insights & Recommendations</h3>
      <div className="mt-4 space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${bgMap[insight.type]}`}>
            {iconMap[insight.type]}
            <p className="text-sm text-card-foreground">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
