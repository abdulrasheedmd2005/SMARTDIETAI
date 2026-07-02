'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, AuthContextType } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
      }
      setIsLoading(false)
    }

    
    getSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ! })
      } else {
        setUser(null)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setUser({ id: data.user.id, email: data.user.email! })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
    
      const{data, error} = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      if(data.user){
        setUser({ id: data.user.id, email: data.user.email! })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      await supabase.auth.signOut()
      setUser(null) 
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
