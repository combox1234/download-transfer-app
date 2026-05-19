import useSWR from 'swr'
import { listSchedules, getSchedule } from '@/lib/api/schedules'
import type { BackupSchedule } from '@/lib/types/api'
import { mockSchedules } from '@/lib/mock-data'

interface ScheduleFilters {
  deviceId?: string
  isEnabled?: boolean
}

export function useSchedules(filters?: ScheduleFilters) {
  const cacheKey = filters
    ? `schedules-${JSON.stringify(filters)}`
    : 'schedules'

  const { data, error, isLoading, mutate } = useSWR<{
    data?: BackupSchedule[]
    error?: string
  }>(cacheKey, () => listSchedules(filters))

  return {
    schedules: data?.data || mockSchedules,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
    mutate,
  }
}

export function useSchedule(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{
    data?: BackupSchedule
    error?: string
  }>(
    id ? `schedule-${id}` : null,
    () => (id ? getSchedule(id) : Promise.reject('No ID'))
  )

  return {
    schedule: data?.data,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
    mutate,
  }
}
