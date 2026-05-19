import useSWR from 'swr'
import { getRunFileLogs } from '@/lib/api/runs'
import type { FileLog, FileLogStatus } from '@/lib/types/api'

export function useFileLogs(
  runId: string | null,
  status?: FileLogStatus,
  page = 0,
  size = 20
) {
  const cacheKey = runId
    ? `filelogs-${runId}-${status || 'all'}-p${page}`
    : null

  const { data, error, isLoading, mutate } = useSWR<{
    data?: FileLog[]
    total?: number
    error?: string
  }>(cacheKey, () =>
    runId
      ? getRunFileLogs(runId, status, page, size)
      : Promise.reject('No runId')
  )

  return {
    logs: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
    mutate,
  }
}
