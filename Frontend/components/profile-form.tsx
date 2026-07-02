'use client'

import { useState, useEffect } from 'react'
import { Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfile, saveProfile } from '@/lib/store'
import { toast } from 'sonner'
import type { UserProfile } from '@/lib/types'
import { supabase } from  "@/lib/supabase"
import { useAuth } from '@/contexts/auth-context'

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', description: 'Reduce calorie intake' },
  { value: 'muscle_gain', label: 'Muscle Gain', description: 'High protein focus' },
  { value: 'keto', label: 'Keto Diet', description: 'Low carb, high fat' },
  { value: 'maintain', label: 'Maintain Weight', description: 'Balanced nutrition' },
] as const

export function ProfileForm() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    weight: 70,
    height: 170,
    goal: 'maintain',
    dailyCalorieGoal: 2000,
    dailyCarbsGoal: 250,
    dailySodiumGoal: 2300,
    dailyCholesterolGoal: 300,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setProfile(getProfile())
  }, [])

  const handleSave = async() => {
    if (!user) return
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          weight: profile.weight,
          height: profile.height,
          fitness_goal: profile.goal,
          daily_calorie_goal: profile.dailyCalorieGoal,
          daily_carb_goal: profile.dailyCarbsGoal,
          daily_sodium_goal: profile.dailySodiumGoal,
          daily_cholesterol_goal: profile.dailyCholesterolGoal,
        })
        .eq('id', user.id)

      if (error) {
        console.error(error)
        return
      }
    

    saveProfile(profile)
    setSaved(true)
    toast.success('Profile updated successfully!')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Body Metrics */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Body Metrics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="text-card-foreground">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={profile.weight}
              onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-card-foreground">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={profile.height}
              onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Daily Nutrition Goals */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Daily Nutrition Goals</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="calorieGoal" className="text-card-foreground">Calorie Goal (kcal)</Label>
            <Input
              id="calorieGoal"
              type="number"
              value={profile.dailyCalorieGoal}
              onChange={(e) => setProfile({ ...profile, dailyCalorieGoal: parseFloat(e.target.value) || 2000 })}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="carbsGoal" className="text-card-foreground text-xs">Carbs (g)</Label>
              <Input
                id="carbsGoal"
                type="number"
                value={profile.dailyCarbsGoal || 250}
                onChange={(e) => setProfile({ ...profile, dailyCarbsGoal: parseFloat(e.target.value) || 250 })}
                className="mt-1.5 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="sodiumGoal" className="text-card-foreground text-xs">Sodium (mg)</Label>
              <Input
                id="sodiumGoal"
                type="number"
                value={profile.dailySodiumGoal || 2300}
                onChange={(e) => setProfile({ ...profile, dailySodiumGoal: parseFloat(e.target.value) || 2300 })}
                className="mt-1.5 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="cholesterolGoal" className="text-card-foreground text-xs">Cholesterol (mg)</Label>
              <Input
                id="cholesterolGoal"
                type="number"
                value={profile.dailyCholesterolGoal || 300}
                onChange={(e) => setProfile({ ...profile, dailyCholesterolGoal: parseFloat(e.target.value) || 300 })}
                className="mt-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Goal */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Fitness Goal</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <button
              key={goal.value}
              onClick={() => setProfile({ ...profile, goal: goal.value })}
              className={`flex flex-col items-start rounded-lg border p-4 text-left transition-all ${
                profile.goal === goal.value
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-card-foreground">{goal.label}</span>
                {profile.goal === goal.value && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <span className="mt-1 text-xs text-muted-foreground">{goal.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BMI Display */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Body Mass Index (BMI)</h3>
        <div>
          {profile.height > 0 && profile.weight > 0 ? (
            <>
              <p className="text-4xl font-bold text-card-foreground">
                {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {(() => {
                  const bmi = profile.weight / Math.pow(profile.height / 100, 2)
                  if (bmi < 18.5) return '📊 Underweight - Consider a balanced diet'
                  if (bmi < 25) return '✅ Normal weight - Great job!'
                  if (bmi < 30) return '⚠️ Overweight - Focus on nutrition'
                  return '🔴 Obese - Consult with a healthcare provider'
                })()}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Enter weight and height to calculate BMI</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <Button className="w-full h-11 text-base font-semibold" onClick={handleSave}>
        {saved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Profile Saved!
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </>
        )}
      </Button>
    </div>
  )
}

