import axios from 'axios'
import type { ApiResponse } from '../types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach token from cookie
apiClient.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1]
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor: redirect on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/login')
    ) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Generic API call wrapper — NEVER throws to components.
 * Returns { data } on success, { error } on failure.
 */
export async function apiCall<T>(
  fn: () => Promise<{ data: T }>
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fn()
    return { data: response.data }
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string } }; message?: string }
    const message =
      axiosErr.response?.data?.error || axiosErr.message || 'Network error'
    return { error: message }
  }
}

/**
 * API call with ApiResponse<T> wrapper — extracts .data from the response body.
 */
export async function apiCallWrapped<T>(
  fn: () => Promise<{ data: ApiResponse<T> }>
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fn()
    if (response.data.success && response.data.data !== undefined) {
      return { data: response.data.data }
    }
    return { error: response.data.error || 'Unknown error' }
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string } }; message?: string }
    const message =
      axiosErr.response?.data?.error || axiosErr.message || 'Network error'
    return { error: message }
  }
}

export default apiClient
