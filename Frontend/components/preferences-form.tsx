'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { getProfile, saveProfile } from '@/lib/store'
import type { UserProfile } from '@/lib/types'
import { supabase } from  "@/lib/supabase"
import { useAuth } from '@/contexts/auth-context'
const foodAllergies = [
  { id: 'milk', label: 'Milk' },
  { id: 'lactose', label: 'Lactose' },
  { id: 'almond', label: 'Almond' },
  { id: 'peanut', label: 'Peanut' },
  { id: 'soy', label: 'Soy' },
  { id: 'egg', label: 'Egg' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'non-veg', label: 'Non-Vegetarian'},
]

const dietRestrictions = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'organic', label: 'Organic' },
  { id: 'diabetic-friendly', label: 'Diabetic Friendly' },
  { id: 'renal-diet', label: 'Renal Diet' },
]

export function PreferencesForm() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    weight: 70,
    height: 170,
    goal: 'maintain',
    dailyCalorieGoal: 2000,
    dailyCarbsGoal: 250,
    dailySodiumGoal: 2300,
    dailyCholesterolGoal: 300,
    foodAllergies: [],
    dietRestrictions: [],
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedProfile = getProfile()
    setProfile(savedProfile)
  }, [])

  const toggleAllergy = (allergyId: string) => {
    const allergies = profile.foodAllergies || []
    const updated = allergies.includes(allergyId)
      ? allergies.filter(a => a !== allergyId)
      : [...allergies, allergyId]
    setProfile({ ...profile, foodAllergies: updated })
  }

  const toggleRestriction = (restrictionId: string) => {
    const restrictions = profile.dietRestrictions || []
    const updated = restrictions.includes(restrictionId)
      ? restrictions.filter(r => r !== restrictionId)
      : [...restrictions, restrictionId]
    setProfile({ ...profile, dietRestrictions: updated })
  }

  const handleSave = async () => {
  
    if(!user) return

    const { data: existing} = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()
    if(existing){
      const { error } = await supabase
        .from('profiles')
        .update({
          allergies: profile.foodAllergies,
          diet_restrictions: profile.dietRestrictions
        })
        .eq('id', user.id)
      if (error) {
        console.error(error)
        return
      }
    }
    else{
    const{error} = await supabase.from('profiles').insert([{
      id:user.id,
      allergies: profile.foodAllergies,
      diet_restrictions: profile.dietRestrictions
    }])
    if(error){
      console.error( error)
      return
    }
  } 
    
    saveProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  return (
    <div className="space-y-6">
      {/* Food Allergies */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Food Allergies</h3>
        <p className="text-xs text-muted-foreground mb-4">Select any allergies to receive health warnings</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {foodAllergies.map((allergy) => (
            <button
              key={allergy.id}
              onClick={() => toggleAllergy(allergy.id)}
              className={`flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-all ${
                (profile.foodAllergies || []).includes(allergy.id)
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                  : 'border-border bg-secondary/30 text-card-foreground hover:border-red-500/50'
              }`}
            >
              <span>{allergy.label}</span>
              {(profile.foodAllergies || []).includes(allergy.id) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Diet Restrictions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Diet Restrictions</h3>
        <p className="text-xs text-muted-foreground mb-4">Select your dietary preferences</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {dietRestrictions.map((restriction) => (
            <button
              key={restriction.id}
              onClick={() => toggleRestriction(restriction.id)}
              className={`flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-all ${
                (profile.dietRestrictions || []).includes(restriction.id)
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                  : 'border-border bg-secondary/30 text-card-foreground hover:border-green-500/50'
              }`}
            >
              <span>{restriction.label}</span>
              {(profile.dietRestrictions || []).includes(restriction.id) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full h-11 px-4 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {saved ? 'Preferences Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}
