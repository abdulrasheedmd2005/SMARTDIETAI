'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProfileForm } from '@/components/profile-form'
import { PreferencesForm } from '@/components/preferences-form'
import { useAuth } from '@/contexts/auth-context'


export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile')
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal information and dietary preferences
            </p>
          </header>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                activeTab === 'preferences'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dietary Preferences
            </button>
          </div>

          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'preferences' && <PreferencesForm />}
        </div>
      </main>
    </div>
  )
}

