import useSWR from 'swr'
import { listDevices } from '@/lib/api/devices'
import type { Device } from '@/lib/types/api'
import { mockDevices } from '@/lib/mock-data'

export function useDevices() {
  const { data, error, isLoading, mutate } = useSWR<{
    data?: Device[]
    error?: string
  }>('devices', listDevices)

  return {
    devices: data?.data || mockDevices,
    isLoading,
    error: data?.error || (error ? String(error) : undefined),
    mutate,
  }
}
