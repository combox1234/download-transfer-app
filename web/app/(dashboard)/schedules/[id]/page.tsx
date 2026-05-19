'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight,
  FolderOpen,
  Save,
  Loader2,
  X,
} from 'lucide-react'
import Header from '@/components/shared/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import StatusBadge from '@/components/shared/StatusBadge'
import { useSchedule } from '@/lib/hooks/useSchedules'
import { useBackupRuns } from '@/lib/hooks/useBackupRuns'
import { updateSchedule } from '@/lib/api/schedules'
import { formatDate, formatBytes, formatDuration } from '@/lib/utils'
import type { BackupMode } from '@/lib/types/api'

export default function ScheduleDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { schedule, isLoading } = useSchedule(id)
  const { runs, isLoading: runsLoading } = useBackupRuns({ scheduleId: id, size: 20 })

  const [triggerHour, setTriggerHour] = useState(0)
  const [triggerMinute, setTriggerMinute] = useState(0)
  const [mode, setMode] = useState<BackupMode>('COPY')
  const [isEnabled, setIsEnabled] = useState(true)
  const [fileFilterInput, setFileFilterInput] = useState('')
  const [fileFilters, setFileFilters] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (schedule) {
      setTriggerHour(schedule.triggerHour)
      setTriggerMinute(schedule.triggerMinute)
      setMode(schedule.mode)
      setIsEnabled(schedule.isEnabled)
      if (schedule.fileFilter) {
        setFileFilters(schedule.fileFilter.split(',').map((f) => f.trim()).filter(Boolean))
      }
    }
  }, [schedule])

  const handleAddFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && fileFilterInput.trim()) {
      e.preventDefault()
      setFileFilters((prev) => [...prev, fileFilterInput.trim()])
      setFileFilterInput('')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)
    await updateSchedule(id, {
      triggerHour,
      triggerMinute,
      mode,
      isEnabled,
      fileFilter: fileFilters.length > 0 ? fileFilters.join(',') : null,
    })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: String(i).padStart(2, '0'),
  }))
  const minuteOptions = [0, 15, 30, 45].map((m) => ({
    value: String(m),
    label: String(m).padStart(2, '0'),
  }))

  if (isLoading) {
    return (
      <>
        <Header title="Schedule" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    )
  }

  if (!schedule) {
    return (
      <>
        <Header title="Schedule" />
        <div className="p-6">
          <p className="text-muted-foreground">Schedule not found</p>
        </div>
      </>
    )
  }

  const sourceBasename = schedule.sourceUri.split('/').pop() || 'Schedule'

  return (
    <>
      <Header title={sourceBasename} />
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/schedules" className="hover:text-foreground transition-colors">
            Schedules
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{sourceBasename}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Edit form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Source path */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Source path</label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={schedule.sourceUri}
                      readOnly
                      className="pl-10 font-mono text-sm bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Destination</label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={schedule.destUri}
                      readOnly
                      className="pl-10 font-mono text-sm bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Trigger time */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Trigger time</label>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={String(triggerHour)}
                      onValueChange={(v) => setTriggerHour(Number(v))}
                      options={hourOptions}
                      className="w-20"
                    />
                    <span className="text-lg font-bold text-muted-foreground">:</span>
                    <Select
                      value={String(triggerMinute)}
                      onValueChange={(v) => setTriggerMinute(Number(v))}
                      options={minuteOptions}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Backup mode</label>
                  <div className="flex gap-3">
                    {(['COPY', 'MOVE'] as BackupMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex-1 p-3 rounded-lg border-2 transition-colors duration-150 text-left ${
                          mode === m
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <p className="text-sm font-medium">{m === 'COPY' ? 'Copy' : 'Move'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {m === 'COPY'
                            ? 'Keep original files in source'
                            : 'Remove original files after backup'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File filter */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    File filter
                  </label>
                  <Input
                    value={fileFilterInput}
                    onChange={(e) => setFileFilterInput(e.target.value)}
                    onKeyDown={handleAddFilter}
                    placeholder="Type filter (e.g. *.pdf) and press Enter"
                  />
                  {fileFilters.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {fileFilters.map((f, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          <span className="font-mono text-xs">{f}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFileFilters((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enabled */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Enabled</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Schedule will run automatically when enabled
                    </p>
                  </div>
                  <Toggle checked={isEnabled} onCheckedChange={setIsEnabled} />
                </div>

                {/* Save */}
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    'Saved ✓'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Run history */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Run History</CardTitle>
              </CardHeader>
              <CardContent>
                {runsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : runs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No runs for this schedule
                  </p>
                ) : (
                  <div className="space-y-0">
                    {runs.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                      >
                        <StatusBadge status={run.status} dot />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {formatDate(run.startedAt)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {run.totalFiles} files · {formatBytes(run.bytesCopied)} ·{' '}
                            {formatDuration(run.startedAt, run.endedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
