import { subHours, subDays, subMinutes, addMinutes } from 'date-fns'
import type {
  Device,
  BackupSchedule,
  BackupRun,
  FileLog,
  StatsSummary,
  RunStatus,
  FileLogStatus,
} from './types/api'

const now = new Date()

// ── Devices ──────────────────────────────────────────────────────────────────

export const mockDevices: Device[] = [
  {
    id: 'dev-001-a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    userId: 'user-001',
    deviceName: 'Pixel 8 Pro',
    lastSeenAt: subHours(now, 2).toISOString(),
    activeSchedulesCount: 2,
    totalRunsCount: 42,
  },
  {
    id: 'dev-002-b2c3d4e5-f6a7-8901-bcde-f12345678901',
    userId: 'user-001',
    deviceName: 'Galaxy S24 Ultra',
    lastSeenAt: subDays(now, 1).toISOString(),
    activeSchedulesCount: 1,
    totalRunsCount: 28,
  },
  {
    id: 'dev-003-c3d4e5f6-a7b8-9012-cdef-123456789012',
    userId: 'user-001',
    deviceName: 'OnePlus 12',
    lastSeenAt: subHours(now, 5).toISOString(),
    activeSchedulesCount: 2,
    totalRunsCount: 18,
  },
]

// ── Schedules ────────────────────────────────────────────────────────────────

export const mockSchedules: BackupSchedule[] = [
  {
    id: 'sch-001-d4e5f6a7-b8c9-0123-defa-234567890123',
    userId: 'user-001',
    deviceId: mockDevices[0].id,
    deviceName: 'Pixel 8 Pro',
    sourceUri: '/storage/emulated/0/Download',
    destUri: '/storage/sdcard1/Backup/Downloads',
    destType: 'SD_CARD',
    triggerHour: 12,
    triggerMinute: 0,
    mode: 'COPY',
    isEnabled: true,
    fileFilter: null,
    createdAt: subDays(now, 45).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
    lastRunStatus: 'SUCCESS',
    lastRunAt: subHours(now, 12).toISOString(),
  },
  {
    id: 'sch-002-e5f6a7b8-c9d0-1234-efab-345678901234',
    userId: 'user-001',
    deviceId: mockDevices[0].id,
    deviceName: 'Pixel 8 Pro',
    sourceUri: '/storage/emulated/0/DCIM/Camera',
    destUri: '/storage/emulated/0/Backup/Photos',
    destType: 'INTERNAL',
    triggerHour: 23,
    triggerMinute: 0,
    mode: 'MOVE',
    isEnabled: true,
    fileFilter: '*.jpg,*.png,*.heic',
    createdAt: subDays(now, 30).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    lastRunStatus: 'PARTIAL',
    lastRunAt: subHours(now, 25).toISOString(),
  },
  {
    id: 'sch-003-f6a7b8c9-d0e1-2345-fabc-456789012345',
    userId: 'user-001',
    deviceId: mockDevices[1].id,
    deviceName: 'Galaxy S24 Ultra',
    sourceUri: '/storage/emulated/0/Documents',
    destUri: '/storage/usbotg/Backup/Docs',
    destType: 'USB_OTG',
    triggerHour: 8,
    triggerMinute: 0,
    mode: 'COPY',
    isEnabled: true,
    fileFilter: '*.pdf,*.docx,*.xlsx',
    createdAt: subDays(now, 20).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
    lastRunStatus: 'SUCCESS',
    lastRunAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'sch-004-a7b8c9d0-e1f2-3456-abcd-567890123456',
    userId: 'user-001',
    deviceId: mockDevices[1].id,
    deviceName: 'Galaxy S24 Ultra',
    sourceUri: '/storage/emulated/0/Download',
    destUri: '/storage/emulated/0/Backup/Downloads',
    destType: 'INTERNAL',
    triggerHour: 14,
    triggerMinute: 0,
    mode: 'MOVE',
    isEnabled: false,
    fileFilter: null,
    createdAt: subDays(now, 15).toISOString(),
    updatedAt: subDays(now, 5).toISOString(),
    lastRunStatus: undefined,
    lastRunAt: undefined,
  },
  {
    id: 'sch-005-b8c9d0e1-f2a3-4567-bcde-678901234567',
    userId: 'user-001',
    deviceId: mockDevices[2].id,
    deviceName: 'OnePlus 12',
    sourceUri: '/storage/emulated/0/DCIM/Video',
    destUri: '/storage/sdcard1/Backup/Videos',
    destType: 'SD_CARD',
    triggerHour: 2,
    triggerMinute: 0,
    mode: 'COPY',
    isEnabled: true,
    fileFilter: '*.mp4,*.mov',
    createdAt: subDays(now, 10).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    lastRunStatus: 'FAILED',
    lastRunAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'sch-006-c9d0e1f2-a3b4-5678-cdef-789012345678',
    userId: 'user-001',
    deviceId: mockDevices[2].id,
    deviceName: 'OnePlus 12',
    sourceUri: '/storage/emulated/0/Download/APK',
    destUri: '/storage/emulated/0/Backup/APKs',
    destType: 'INTERNAL',
    triggerHour: 18,
    triggerMinute: 0,
    mode: 'COPY',
    isEnabled: true,
    fileFilter: '*.apk',
    createdAt: subDays(now, 7).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    lastRunStatus: 'SUCCESS',
    lastRunAt: subHours(now, 6).toISOString(),
  },
]

// ── Backup Runs ──────────────────────────────────────────────────────────────

function makeRun(
  idx: number,
  scheduleIdx: number,
  hoursAgo: number,
  status: RunStatus,
  totalFiles: number,
  failedFiles: number,
  bytesCopied: number,
  durationMinutes: number,
  errorMessage?: string
): BackupRun {
  const started = subHours(now, hoursAgo)
  const ended = status === 'RUNNING' ? undefined : addMinutes(started, durationMinutes)
  const schedule = mockSchedules[scheduleIdx]
  return {
    id: `run-${String(idx).padStart(3, '0')}-${schedule.id.slice(4, 20)}`,
    scheduleId: schedule.id,
    deviceId: schedule.deviceId,
    deviceName: schedule.deviceName,
    scheduleName: schedule.sourceUri.split('/').pop() || 'Backup',
    startedAt: started.toISOString(),
    endedAt: ended?.toISOString(),
    status,
    totalFiles,
    movedFiles: totalFiles - failedFiles,
    failedFiles,
    bytesCopied,
    errorMessage,
  }
}

export const mockBackupRuns: BackupRun[] = [
  makeRun(1, 0, 0.5, 'RUNNING', 47, 0, 120_000_000, 0),
  makeRun(2, 0, 12, 'SUCCESS', 83, 0, 450_000_000, 8),
  makeRun(3, 1, 25, 'PARTIAL', 120, 3, 890_000_000, 15),
  makeRun(4, 2, 24, 'SUCCESS', 45, 0, 320_000_000, 5),
  makeRun(5, 5, 6, 'SUCCESS', 12, 0, 85_000_000, 2),
  makeRun(6, 4, 24, 'FAILED', 68, 68, 0, 1, 'SD card not mounted: /storage/sdcard1 unavailable'),
  makeRun(7, 0, 36, 'SUCCESS', 91, 0, 520_000_000, 9),
  makeRun(8, 1, 49, 'SUCCESS', 105, 0, 780_000_000, 12),
  makeRun(9, 2, 48, 'SUCCESS', 38, 0, 210_000_000, 4),
  makeRun(10, 5, 30, 'SUCCESS', 8, 0, 42_000_000, 1),
  makeRun(11, 0, 60, 'PARTIAL', 76, 5, 380_000_000, 7),
  makeRun(12, 4, 48, 'FAILED', 52, 52, 0, 0, 'Permission denied: WRITE_EXTERNAL_STORAGE'),
  makeRun(13, 1, 73, 'SUCCESS', 98, 0, 720_000_000, 11),
  makeRun(14, 2, 72, 'SUCCESS', 42, 0, 290_000_000, 5),
  makeRun(15, 0, 84, 'SUCCESS', 64, 0, 350_000_000, 6),
  makeRun(16, 5, 54, 'SUCCESS', 15, 0, 95_000_000, 2),
  makeRun(17, 1, 97, 'PARTIAL', 130, 8, 950_000_000, 18),
  makeRun(18, 4, 72, 'FAILED', 35, 35, 0, 0, 'Destination full: 0 bytes remaining'),
  makeRun(19, 2, 96, 'SUCCESS', 51, 0, 340_000_000, 6),
  makeRun(20, 0, 108, 'SUCCESS', 72, 0, 410_000_000, 7),
  makeRun(21, 1, 121, 'SUCCESS', 88, 0, 640_000_000, 10),
  makeRun(22, 5, 78, 'SUCCESS', 10, 0, 58_000_000, 1),
  makeRun(23, 0, 132, 'PARTIAL', 95, 2, 480_000_000, 9),
  makeRun(24, 2, 120, 'SUCCESS', 33, 0, 180_000_000, 3),
  makeRun(25, 1, 145, 'PARTIAL', 110, 4, 830_000_000, 14),
]

// ── Stats Summary ────────────────────────────────────────────────────────────

export const mockStats: StatsSummary = {
  activeSchedules: 5,
  totalSchedules: 6,
  last30DaysRuns: 25,
  successRate: 0.84,
  totalBytesCopiedLast30Days: 45_000_000_000,
  lastRunAt: subHours(now, 2).toISOString(),
  failedTransfersPending: 7,
  storageHealthByDevice: [
    {
      deviceId: mockDevices[0].id,
      deviceName: 'Pixel 8 Pro',
      bytesCopied30Days: 20_000_000_000,
    },
    {
      deviceId: mockDevices[1].id,
      deviceName: 'Galaxy S24 Ultra',
      bytesCopied30Days: 15_000_000_000,
    },
    {
      deviceId: mockDevices[2].id,
      deviceName: 'OnePlus 12',
      bytesCopied30Days: 10_000_000_000,
    },
  ],
}

// ── File Logs ────────────────────────────────────────────────────────────────

const fileNames = [
  'IMG_20250510_142355.jpg',
  'IMG_20250511_091023.png',
  'IMG_20250512_183401.heic',
  'document_scan.pdf',
  'budget_2025.xlsx',
  'meeting_notes.docx',
  'presentation_final.pptx',
  'vacation_clip.mp4',
  'screen_recording.mov',
  'birthday_video.mp4',
  'app_backup_v3.2.apk',
  'nova_launcher.apk',
  'tasker_config.apk',
  'grocery_list.txt',
  'README.md',
  'config_backup.json',
  'database_export.sql',
  'photo_001.jpg',
  'photo_002.jpg',
  'photo_003.png',
  'video_clip_01.mp4',
  'video_clip_02.mp4',
  'report_q4.pdf',
  'invoice_jan.pdf',
  'contract_signed.pdf',
  'family_photo.jpg',
  'selfie_paris.jpg',
  'sunset_beach.heic',
  'podcast_ep42.mp3',
  'voice_memo_01.m4a',
  'ebook_kotlin.epub',
  'wallpaper_4k.png',
  'system_log.txt',
  'crash_report.log',
  'wifi_passwords.xml',
  'contacts_export.vcf',
  'calendar_backup.ics',
  'thumbnail_cache.db',
  'font_roboto.ttf',
  'icon_pack.zip',
  'game_save_01.dat',
  'music_playlist.m3u',
  'notes_archive.tar.gz',
  'photo_edited.jpg',
  'sketch_design.png',
  'audio_recording.wav',
  'firmware_update.bin',
  'certificate.pem',
  'app_data.bak',
  'download_temp.part',
]

const errorCodes = ['IO_ERROR', 'PERMISSION_DENIED', 'DUPLICATE', 'DEST_FULL'] as const

function generateFileLogs(runId: string, count: number, failedCount: number, skippedCount: number): FileLog[] {
  const logs: FileLog[] = []
  const statuses: FileLogStatus[] = []

  for (let i = 0; i < failedCount; i++) statuses.push('FAILED')
  for (let i = 0; i < skippedCount; i++) statuses.push('SKIPPED')
  for (let i = statuses.length; i < count; i++) statuses.push('SUCCESS')

  // Shuffle
  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(i * 7 + count)) * (i + 1))
    const k = j % statuses.length;
    [statuses[i], statuses[k]] = [statuses[k], statuses[i]]
  }

  for (let i = 0; i < count; i++) {
    const status = statuses[i]
    const fileName = fileNames[i % fileNames.length]
    logs.push({
      id: `flog-${runId.slice(4, 12)}-${String(i).padStart(3, '0')}`,
      runId,
      fileName,
      fileSize: Math.floor(50_000 + Math.abs(Math.sin(i * 13)) * 50_000_000),
      sourceUri: `/storage/emulated/0/Download/${fileName}`,
      destUri: status === 'FAILED' ? undefined : `/storage/sdcard1/Backup/${fileName}`,
      status,
      errorCode: status === 'FAILED' ? errorCodes[i % errorCodes.length] : undefined,
      transferredAt: subMinutes(now, count - i).toISOString(),
    })
  }
  return logs
}

// Pre-generate file logs for key runs
const allFileLogs: Record<string, FileLog[]> = {}

mockBackupRuns.forEach((run) => {
  const skipped = run.status === 'PARTIAL' ? Math.max(0, run.totalFiles - run.movedFiles - run.failedFiles) : 0
  allFileLogs[run.id] = generateFileLogs(run.id, run.totalFiles, run.failedFiles, skipped)
})

export const mockFileLogs = allFileLogs

// ── Mock helpers ─────────────────────────────────────────────────────────────

export function getMockRunById(id: string): BackupRun | undefined {
  return mockBackupRuns.find((r) => r.id === id)
}

export function getMockRunFiles(
  runId: string,
  status?: FileLogStatus
): FileLog[] {
  const logs = mockFileLogs[runId] || []
  if (!status) return logs
  return logs.filter((l) => l.status === status)
}

export function getMockScheduleById(id: string): BackupSchedule | undefined {
  return mockSchedules.find((s) => s.id === id)
}

export function getMockScheduleRuns(scheduleId: string): BackupRun[] {
  return mockBackupRuns.filter((r) => r.scheduleId === scheduleId)
}

export const mockUser = {
  id: 'user-001-00000000-0000-0000-0000-000000000001',
  email: 'demo@autobackup.app',
  createdAt: subDays(now, 60).toISOString(),
}
