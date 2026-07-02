'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Droplet, Dumbbell, CircleDot, Wheat, Zap, AlertCircle } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { MetricCard } from '@/components/metric-card'
import { ProgressCard } from '@/components/progress-card'
import { InsightsCard } from '@/components/insights-card'

import { useAuth } from '@/contexts/auth-context'
import { supabase } from "@/lib/supabase"
import type { DailyTotals, UserProfile, FoodEntry } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [totals, setTotals] = useState<DailyTotals>({ calories: 0, sugar: 0, protein: 0, fat: 0, carbohydrates: 0, sodium: 0, cholesterol: 0 })
  const [profile, setProfile] = useState<UserProfile>({ weight: 70, height: 170, goal: 'maintain', dailyCalorieGoal: 2000, dailyCarbsGoal: 250, dailySodiumGoal: 2300, dailyCholesterolGoal: 300 })
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
        return
      }
     if (user) {
  const loadData = async () => {
    // Food Entries
    const { data: entries , error} = await supabase
      .from("food_entries")
      .select("*")
      .eq("user_id", user.id)

    setFoodEntries(entries || [])
    
    // Totals
    const totals = (entries || []).reduce(
      (acc, entry) => ({
        calories: acc.calories + Number(entry.calories || 0),
        sugar: acc.sugar + Number(entry.sugar || 0),
        protein: acc.protein + Number(entry.protein || 0),
        fat: acc.fat + Number(entry.fat || 0),
        carbohydrates: acc.carbohydrates + Number(entry.carbohydrates || 0),
        sodium: acc.sodium + Number(entry.sodium || 0),
        cholesterol: acc.cholesterol + Number(entry.cholesterol || 0),
      }),
      {
        calories: 0,
        sugar: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        sodium: 0,
        cholesterol: 0,
      }
    )

    setTotals(totals)

    // Profile
    const { data: p , error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    if (profileError) {
      console.error(profileError)
    } else if (p) {
      
      setProfile({
        weight: p.weight,
        height: p.height,
        goal: (p.fitness_goal || 'maintain' ) as 'weight_loss' | 'muscle_gain' | 'keto' |'maintain',
        dailyCalorieGoal: p.daily_calorie_goal,
        dailyCarbsGoal: p.daily_carb_goal,
        dailySodiumGoal: p.daily_sodium_goal,
        dailyCholesterolGoal: p.daily_cholesterol_goal,
        foodAllergies: p.allergies || [],
        dietRestrictions: p.diet_restrictions || [],
      })
    }

    setIsPageLoading(false)
  }

  loadData()
}
    }
  }, [authLoading, user, router])

  if (authLoading || isPageLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your daily nutrition and stay on top of your health goals
            </p>
          </header>

          {/* Metric Cards - Organized Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Calories"
              value={totals.calories}
              goal={profile.dailyCalorieGoal}
              unit="kcal"
              icon={<Flame className="h-5 w-5" />}
              color="emerald"
            />
            <MetricCard
              title="Carbs"
              value={totals.carbohydrates}
              goal={profile.dailyCarbsGoal}
              unit="g"
              icon={<Wheat className="h-5 w-5" />}
              color="amber"
            />
            <MetricCard
              title="Protein"
              value={totals.protein}
              goal={100}
              unit="g"
              icon={<Dumbbell className="h-5 w-5" />}
              color="blue"
            />
            <MetricCard
              title="Fat"
              value={totals.fat}
              unit="g"
              icon={<CircleDot className="h-5 w-5" />}
              color="red"
            />
            <MetricCard
              title="Sugar"
              value={totals.sugar}
              unit="g"
              icon={<Droplet className="h-5 w-5" />}
              color="violet"
            />
            <MetricCard
              title="Sodium"
              value={totals.sodium}
              goal={profile.dailySodiumGoal}
              unit="mg"
              icon={<Zap className="h-5 w-5" />}
              color="cyan"
            />
            <MetricCard
              title="Cholesterol"
              value={totals.cholesterol}
              goal={profile.dailyCholesterolGoal}
              unit="mg"
              icon={<AlertCircle className="h-5 w-5" />}
              color="orange"
            />
          </div>

          {/* Progress Section */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ProgressCard current={totals.calories} goal={profile.dailyCalorieGoal} />
            <InsightsCard profile={profile} totals={totals} entries={foodEntries} />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-sm font-semibold text-foreground mb-4">Today&apos;s Summary</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Goal</p>
                <p className="text-lg font-semibold capitalize text-card-foreground">
                  {(profile.goal || 'maintain') .replace('_', ' ')} 
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Target Calories</p>
                <p className="text-lg font-semibold text-card-foreground">
                  {profile.dailyCalorieGoal} kcal
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Consumed</p>
                <p className="text-lg font-semibold text-primary">
                  {totals.calories} kcal
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Remaining</p>
                <p className={`text-lg font-semibold ${totals.calories > profile.dailyCalorieGoal ? 'text-destructive' : 'text-emerald-600'}`}>
                  {Math.max(profile.dailyCalorieGoal - totals.calories, 0)} kcal
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

