import apiClient, { apiCall } from './client'
import type { BackupSchedule } from '../types/api'
import { mockSchedules, getMockScheduleById } from '../mock-data'

interface ScheduleFilters {
  deviceId?: string
  isEnabled?: boolean
}

export async function listSchedules(
  filters?: ScheduleFilters
): Promise<{ data?: BackupSchedule[]; error?: string }> {
  const result = await apiCall<{ data: BackupSchedule[] }>(() =>
    apiClient.get('/api/schedules', { params: filters })
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for schedules, using mock data')
    let data = [...mockSchedules]
    if (filters?.deviceId) {
      data = data.filter((s) => s.deviceId === filters.deviceId)
    }
    if (filters?.isEnabled !== undefined) {
      data = data.filter((s) => s.isEnabled === filters.isEnabled)
    }
    return { data }
  }
  return { data: result.data?.data || [] }
}

export async function getSchedule(
  id: string
): Promise<{ data?: BackupSchedule; error?: string }> {
  const result = await apiCall<BackupSchedule>(() =>
    apiClient.get(`/api/schedules/${id}`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for schedule detail, using mock data')
    const schedule = getMockScheduleById(id)
    return schedule ? { data: schedule } : { error: 'Schedule not found' }
  }
  return result
}

export async function updateSchedule(
  id: string,
  data: Partial<BackupSchedule>
): Promise<{ data?: BackupSchedule; error?: string }> {
  const result = await apiCall<BackupSchedule>(() =>
    apiClient.put(`/api/schedules/${id}`, data)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock update')
    const schedule = getMockScheduleById(id)
    return schedule ? { data: { ...schedule, ...data } } : { error: 'Not found' }
  }
  return result
}

export async function toggleSchedule(
  id: string
): Promise<{ data?: BackupSchedule; error?: string }> {
  const result = await apiCall<BackupSchedule>(() =>
    apiClient.patch(`/api/schedules/${id}/toggle`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock toggle')
    const schedule = getMockScheduleById(id)
    return schedule
      ? { data: { ...schedule, isEnabled: !schedule.isEnabled } }
      : { error: 'Not found' }
  }
  return result
}

export async function deleteSchedule(
  id: string
): Promise<{ error?: string }> {
  const result = await apiCall<void>(() =>
    apiClient.delete(`/api/schedules/${id}`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock delete')
    return {}
  }
  return {}
}
