import useSWR from 'swr'
import { listRuns, getRunById } from '@/lib/api/runs'
import type { BackupRun } from '@/lib/types/api'
import { mockBackupRuns } from '@/lib/mock-data'

interface RunFilters {
  deviceId?: string
  scheduleId?: string
  status?: string
  size?: number
}

export function useBackupRuns(filters?: RunFilters, page = 0) {
  const cacheKey = `runs-${JSON.stringify(filters || {})}-p${page}`

  const { data, error, isLoading, mutate } = useSWR<{
    data?: BackupRun[]
    total?: number
    error?: string
  }>(cacheKey, () => listRuns({ ...filters, page, size: filters?.size || 20 }))

  return {
    runs: data?.data || mockBackupRuns.slice(0, filters?.size || 20),
    total: data?.total || mockBackupRuns.length,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
    mutate,
  }
}

export function useBackupRun(id: string | null) {
  const { data, error, isLoading } = useSWR<{
    data?: BackupRun
    error?: string
  }>(
    id ? `run-${id}` : null,
    () => (id ? getRunById(id) : Promise.reject('No ID'))
  )

  return {
    run: data?.data,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
  }
}
