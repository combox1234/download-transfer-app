'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Clock, Smartphone, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { register } from '@/lib/api/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const result = await register({ email, password })
      if (result.success) {
        router.push('/login?registered=true')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-16"
        style={{
          background: 'linear-gradient(135deg, #0F1117 0%, #1a1b2e 50%, #0F1117 100%)',
        }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#6366F1]">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              AutoBackup Manager
            </span>
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight">
            Start protecting
            <br />
            <span className="text-[#6366F1]">your files today.</span>
          </h2>
          <p className="text-gray-400 text-base mt-4 leading-relaxed">
            Create your account and connect your Android devices to get started
            with automatic backups.
          </p>
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Shield className="h-5 w-5 text-[#818CF8]" />
              </div>
              <p className="text-gray-300 text-sm">AES-256 encrypted transfers</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Clock className="h-5 w-5 text-[#818CF8]" />
              </div>
              <p className="text-gray-300 text-sm">Scheduled daily backups</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Smartphone className="h-5 w-5 text-[#818CF8]" />
              </div>
              <p className="text-gray-300 text-sm">Works across all Android devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#6366F1]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AutoBackup</span>
          </div>

          <h2 className="text-2xl font-semibold text-foreground">Create account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get started with AutoBackup Manager
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
