import useSWR from 'swr'
import { getStatsSummary } from '@/lib/api/stats'
import { mockStats } from '@/lib/mock-data'
import type { StatsSummary } from '@/lib/types/api'

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<{ data?: StatsSummary; error?: string }>(
    'stats-summary',
    getStatsSummary,
    { refreshInterval: 30000 }
  )

  return {
    stats: data?.data || mockStats,
    error: data?.error || (error ? String(error) : undefined),
    isLoading,
    refresh: mutate,
  }
}
