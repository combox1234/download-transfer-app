import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value.toFixed(i === 0 ? 0 : decimals)} ${sizes[i]}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDuration(startedAt: string, endedAt?: string): string {
  if (!endedAt) return 'Running...'
  const start = new Date(startedAt).getTime()
  const end = new Date(endedAt).getTime()
  const totalSeconds = Math.floor((end - start) / 1000)
  if (totalSeconds < 0) return '—'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export function truncateId(id: string): string {
  if (id.length <= 8) return id
  return id.slice(0, 8)
}

export function formatSuccessRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    SUCCESS: 'text-green-600 bg-green-50',
    FAILED: 'text-red-600 bg-red-50',
    PARTIAL: 'text-amber-600 bg-amber-50',
    RUNNING: 'text-blue-600 bg-blue-50',
    SKIPPED: 'text-gray-500 bg-gray-50',
    DUPLICATE: 'text-amber-500 bg-amber-50',
    PENDING: 'text-gray-500 bg-gray-50',
  }
  return map[status] || 'text-gray-500 bg-gray-50'
}
