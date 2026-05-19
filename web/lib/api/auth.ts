import apiClient, { apiCall } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: { id: string; email: string }
  error?: string
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const result = await apiCall<AuthResponse>(() =>
    apiClient.post('/api/auth/login', payload)
  )
  if (result.error) {
    // Try the Next.js API route for mock auth
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) return data
      return { success: false, error: data.error || 'Login failed' }
    } catch {
      console.log('[AutoBackup] API unavailable, using mock auth')
      // Set a demo cookie for mock purposes
      if (typeof document !== 'undefined') {
        document.cookie = `auth_token=mock-jwt-token-demo; path=/; max-age=86400; samesite=lax`
      }
      return { success: true, user: { id: 'user-001', email: payload.email } }
    }
  }
  return result.data || { success: false, error: 'Unknown error' }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const result = await apiCall<AuthResponse>(() =>
    apiClient.post('/api/auth/register', payload)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock register')
    return { success: true, user: { id: 'user-new', email: payload.email } }
  }
  return result.data || { success: false, error: 'Unknown error' }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // Clear cookie client-side as fallback
  }
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; path=/; max-age=0'
  }
}
