/**
 * API Types — matches backend DTOs exactly.
 */

export type RunStatus = 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED'
export type FileLogStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'DUPLICATE'
export type BackupMode = 'COPY' | 'MOVE'
export type DestinationType = 'INTERNAL' | 'SD_CARD' | 'USB_OTG' | 'CLOUD'

export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Device {
  id: string
  userId: string
  deviceName: string
  lastSeenAt: string
  activeSchedulesCount: number
  totalRunsCount: number
}

export interface BackupSchedule {
  id: string
  userId: string
  deviceId: string
  deviceName: string
  sourceUri: string
  destUri: string
  destType: DestinationType
  triggerHour: number
  triggerMinute: number
  mode: BackupMode
  isEnabled: boolean
  fileFilter: string | null
  createdAt: string
  updatedAt: string
  lastRunStatus?: RunStatus
  lastRunAt?: string
}

export interface BackupRun {
  id: string
  scheduleId: string
  deviceId: string
  deviceName: string
  scheduleName: string
  startedAt: string
  endedAt?: string
  status: RunStatus
  totalFiles: number
  movedFiles: number
  failedFiles: number
  bytesCopied: number
  errorMessage?: string
}

export interface FileLog {
  id: string
  runId: string
  fileName: string
  fileSize: number
  sourceUri: string
  destUri?: string
  status: FileLogStatus
  errorCode?: string
  transferredAt: string
}

export interface StatsSummary {
  activeSchedules: number
  totalSchedules: number
  last30DaysRuns: number
  successRate: number
  totalBytesCopiedLast30Days: number
  lastRunAt?: string
  failedTransfersPending: number
  storageHealthByDevice: Array<{
    deviceId: string
    deviceName: string
    bytesCopied30Days: number
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
