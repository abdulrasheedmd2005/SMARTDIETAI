import type { FoodEntry, UserProfile, DailyTotals } from './types'

const ENTRIES_KEY = 'diet_entries'
const PROFILE_KEY = 'diet_profile'
const USER_KEY = 'diet_user'

export function getEntries(): FoodEntry[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ENTRIES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveEntry(entry: FoodEntry): void {
  const entries = getEntries()
  entries.unshift(entry)
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter(e => e.id !== id)
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return { 
      weight: 70, 
      height: 170, 
      goal: 'maintain', 
      dailyCalorieGoal: 2000,
      dailyCarbsGoal: 250,
      dailySodiumGoal: 2300,
      dailyCholesterolGoal: 300
    }
  }
  const data = localStorage.getItem(PROFILE_KEY)
  return data ? JSON.parse(data) : { 
    weight: 70, 
    height: 170, 
    goal: 'maintain', 
    dailyCalorieGoal: 2000,
    dailyCarbsGoal: 250,
    dailySodiumGoal: 2300,
    dailyCholesterolGoal: 300
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getTodayTotals(): DailyTotals {
  const today = new Date().toISOString().split('T')[0]
  const entries = getEntries().filter(e => e.date.startsWith(today))
  
  return entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    sugar: acc.sugar + entry.sugar,
    protein: acc.protein + entry.protein,
    fat: acc.fat + entry.fat,
    carbohydrates: acc.carbohydrates + entry.carbohydrates,
    sodium: acc.sodium + entry.sodium,
    cholesterol: acc.cholesterol + entry.cholesterol
  }), { calories: 0, sugar: 0, protein: 0, fat: 0, carbohydrates: 0, sodium: 0, cholesterol: 0 })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Auth functions
export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(USER_KEY)
  return data ? JSON.parse(data) : null
}

export function saveUser(user: { id: string; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY)
}
