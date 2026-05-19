'use client'

import { useRouter } from 'next/navigation'
import { Smartphone, History } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { SkeletonTable } from '@/components/ui/skeleton'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatRelativeTime, formatDuration } from '@/lib/utils'
import type { BackupRun } from '@/lib/types/api'

interface RecentRunsTableProps {
  runs: BackupRun[]
  isLoading: boolean
}

export default function RecentRunsTable({ runs, isLoading }: RecentRunsTableProps) {
  const router = useRouter()

  if (isLoading) {
    return <SkeletonTable rows={5} cols={6} />
  }

  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No backup runs yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Runs will appear here once your devices start backing up
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Device</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Started</TableHead>
          <TableHead className="hidden md:table-cell">Duration</TableHead>
          <TableHead className="hidden md:table-cell">Files</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow
            key={run.id}
            className="cursor-pointer"
            onClick={() => router.push(`/history/${run.id}`)}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm">{run.deviceName}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {run.scheduleName}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatRelativeTime(run.startedAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
              {formatDuration(run.startedAt, run.endedAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell text-sm">
              {run.totalFiles} files
            </TableCell>
            <TableCell>
              <StatusBadge status={run.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
