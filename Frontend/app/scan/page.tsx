'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { ScanForm } from '@/components/scan-form'
import { useAuth } from '@/contexts/auth-context'

export default function ScanPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

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
            <h1 className="text-3xl font-bold text-foreground">Scan Food</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a food image or enter nutrition information manually
            </p>
          </header>

          <ScanForm />
        </div>
      </main>
    </div>
  )
}

