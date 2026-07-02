export interface FoodEntry {
  id: string
  name: string
  calories: number
  sugar: number
  protein: number
  fat: number
  carbohydrates: number
  sodium: number
  cholesterol: number
  date: string
  imageUrl?: string
  warnings?: string[]
  timestamp?: number
  created_at?: string
  ingredients?: string[]
  food_name?: string
}

export interface UserProfile {
  weight: number
  height: number
  goal: 'weight_loss' | 'muscle_gain' | 'keto' | 'maintain'
  dailyCalorieGoal: number
  apiKey?: string
  dailyCarbsGoal?: number
  dailySodiumGoal?: number
  dailyCholesterolGoal?: number
  foodAllergies?: string[]
  dietRestrictions?: string[]
}

export interface DailyTotals {
  calories: number
  sugar: number
  protein: number
  fat: number
  carbohydrates: number
  sodium: number
  cholesterol: number
}

export interface User {
  id: string
  email: string
  password?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
