import apiClient, { apiCall } from './client'
import type { Device } from '../types/api'
import { mockDevices } from '../mock-data'

export async function listDevices(): Promise<{ data?: Device[]; error?: string }> {
  const result = await apiCall<{ data: Device[] }>(() =>
    apiClient.get('/api/devices')
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for devices, using mock data')
    return { data: mockDevices }
  }
  return { data: result.data?.data || [] }
}

export async function deleteDevice(
  id: string
): Promise<{ error?: string }> {
  const result = await apiCall<void>(() =>
    apiClient.delete(`/api/devices/${id}`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock delete device')
    return {}
  }
  return {}
}
