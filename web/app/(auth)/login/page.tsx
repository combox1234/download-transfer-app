'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Clock, Smartphone, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
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
            Your files.
            <br />
            <span className="text-[#6366F1]">Always backed up.</span>
          </h2>
          <p className="text-gray-400 text-base mt-4 leading-relaxed">
            Automated backup management for your Android devices. Set it once,
            never worry about losing files again.
          </p>
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Shield className="h-5 w-5 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Secure transfers</p>
                <p className="text-gray-500 text-xs mt-0.5">AES-256 encrypted file transfers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Clock className="h-5 w-5 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Scheduled backups</p>
                <p className="text-gray-500 text-xs mt-0.5">Automatic daily backups on your schedule</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366F1]/10">
                <Smartphone className="h-5 w-5 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Multi-device support</p>
                <p className="text-gray-500 text-xs mt-0.5">Works across all your Android devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#6366F1]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AutoBackup</span>
          </div>

          <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
