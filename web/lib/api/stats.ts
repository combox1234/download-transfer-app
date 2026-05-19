import apiClient, { apiCall } from './client'
import type { StatsSummary } from '../types/api'
import { mockStats } from '../mock-data'

export async function getStatsSummary(): Promise<{ data?: StatsSummary; error?: string }> {
  const result = await apiCall<StatsSummary>(() =>
    apiClient.get('/api/stats/summary')
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for stats, using mock data')
    return { data: mockStats }
  }
  return result
}
