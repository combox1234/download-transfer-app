'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock,
  FolderOpen,
  ArrowRight,
  Pencil,
  Trash2,
  Smartphone,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatRelativeTime } from '@/lib/utils'
import type { BackupSchedule } from '@/lib/types/api'

interface ScheduleCardProps {
  schedule: BackupSchedule
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const destTypeLabels: Record<string, string> = {
  INTERNAL: 'Internal',
  SD_CARD: 'SD Card',
  USB_OTG: 'USB OTG',
  CLOUD: 'Cloud',
}

export default function ScheduleCard({ schedule, onToggle, onDelete }: ScheduleCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const sourceBasename = schedule.sourceUri.split('/').pop() || 'Source'
  const timeStr = `${String(schedule.triggerHour).padStart(2, '0')}:${String(schedule.triggerMinute).padStart(2, '0')}`

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-150">
        <CardContent className="p-5">
          {/* Top row: name + toggle */}
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{sourceBasename}</h3>
              <Badge variant="secondary" className="mt-1.5 gap-1">
                <Smartphone className="h-3 w-3" />
                {schedule.deviceName}
              </Badge>
            </div>
            <Toggle
              checked={schedule.isEnabled}
              onCheckedChange={() => onToggle(schedule.id)}
            />
          </div>

          {/* Source → Destination */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
            <FolderOpen className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xs truncate max-w-[100px]">
              {sourceBasename}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-xs">{destTypeLabels[schedule.destType] || schedule.destType}</span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Every day at {timeStr}</span>
            </div>
            <Badge
              variant={schedule.mode === 'COPY' ? 'default' : 'warning'}
              className="text-[10px] px-2 py-0"
            >
              {schedule.mode}
            </Badge>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              {schedule.lastRunStatus ? (
                <>
                  <StatusBadge status={schedule.lastRunStatus} dot />
                  <span className="text-xs text-muted-foreground">
                    {schedule.lastRunAt
                      ? formatRelativeTime(schedule.lastRunAt)
                      : 'Never'}
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No runs yet</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push(`/schedules/${schedule.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              This will permanently delete the &ldquo;{sourceBasename}&rdquo; schedule.
              Completed backup runs will not be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(schedule.id)
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
