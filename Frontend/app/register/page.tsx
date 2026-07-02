'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Salad, Eye, EyeOff, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const passwordsMatch = password === confirmPassword && password.length > 0
  const passwordStrong = password.length >= 6
  const isFormValid = email && passwordStrong && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordsMatch) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    if (!passwordStrong) {
      setError('Password must be at least 6 characters')
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await register(email, password)
      toast.success('Account created successfully! Welcome to Smart Diet Analyzer!')
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Salad className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
          <p className="text-center text-sm text-muted-foreground">
            Create your Smart Diet Analyzer account today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <p className={`mt-1.5 text-xs font-medium flex items-center gap-1.5 ${passwordStrong ? 'text-green-600' : 'text-muted-foreground'}`}>
                {passwordStrong ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    At least 6 characters
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" />
                    At least 6 characters required
                  </>
                )}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <p className={`mt-1.5 text-xs font-medium flex items-center gap-1.5 ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                {passwordsMatch ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" />
                    Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !isFormValid}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
