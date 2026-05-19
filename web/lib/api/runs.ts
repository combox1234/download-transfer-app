import apiClient, { apiCall } from './client'
import type { BackupRun, FileLog, FileLogStatus } from '../types/api'
import { mockBackupRuns, getMockRunById, getMockRunFiles } from '../mock-data'

interface RunFilters {
  deviceId?: string
  scheduleId?: string
  status?: string
  page?: number
  size?: number
}

export async function listRuns(
  filters?: RunFilters
): Promise<{ data?: BackupRun[]; total?: number; error?: string }> {
  const result = await apiCall<{ data: BackupRun[]; total: number }>(() =>
    apiClient.get('/api/runs', { params: filters })
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for runs, using mock data')
    let data = [...mockBackupRuns]
    if (filters?.deviceId) {
      data = data.filter((r) => r.deviceId === filters.deviceId)
    }
    if (filters?.scheduleId) {
      data = data.filter((r) => r.scheduleId === filters.scheduleId)
    }
    if (filters?.status) {
      data = data.filter((r) => r.status === filters.status)
    }
    const page = filters?.page || 0
    const size = filters?.size || 20
    const start = page * size
    const paged = data.slice(start, start + size)
    return { data: paged, total: data.length }
  }
  return { data: result.data?.data || [], total: result.data?.total || 0 }
}

export async function getRunById(
  id: string
): Promise<{ data?: BackupRun; error?: string }> {
  const result = await apiCall<BackupRun>(() =>
    apiClient.get(`/api/runs/${id}`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for run detail, using mock data')
    const run = getMockRunById(id)
    return run ? { data: run } : { error: 'Run not found' }
  }
  return result
}

export async function getRunFileLogs(
  runId: string,
  status?: FileLogStatus,
  page = 0,
  size = 20
): Promise<{ data?: FileLog[]; total?: number; error?: string }> {
  const result = await apiCall<{ data: FileLog[]; total: number }>(() =>
    apiClient.get(`/api/runs/${runId}/files`, {
      params: { status, page, size },
    })
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable for file logs, using mock data')
    const allLogs = getMockRunFiles(runId, status)
    const start = page * size
    const paged = allLogs.slice(start, start + size)
    return { data: paged, total: allLogs.length }
  }
  return { data: result.data?.data || [], total: result.data?.total || 0 }
}

export async function retryAllFailed(
  runId: string
): Promise<{ error?: string }> {
  const result = await apiCall<void>(() =>
    apiClient.post(`/api/runs/${runId}/failed/retry-all`)
  )
  if (result.error) {
    console.log('[AutoBackup] API unavailable, mock retry')
    return {}
  }
  return {}
}
