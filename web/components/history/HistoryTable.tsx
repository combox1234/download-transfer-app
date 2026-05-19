'use client'

import { useRouter } from 'next/navigation'
import { Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { SkeletonTable } from '@/components/ui/skeleton'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate, formatDuration, formatBytes, truncateId } from '@/lib/utils'
import type { BackupRun } from '@/lib/types/api'

interface HistoryTableProps {
  runs: BackupRun[]
  isLoading: boolean
  total: number
  page: number
  pageSize?: number
  onPageChange: (page: number) => void
}

export default function HistoryTable({
  runs,
  isLoading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: HistoryTableProps) {
  const router = useRouter()

  if (isLoading) {
    return <SkeletonTable rows={8} cols={6} />
  }

  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, total)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Run ID</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Started</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead className="hidden md:table-cell">Files</TableHead>
            <TableHead className="hidden lg:table-cell">Moved</TableHead>
            <TableHead className="hidden lg:table-cell">Failed</TableHead>
            <TableHead className="hidden md:table-cell">Size</TableHead>
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
              <TableCell className="font-mono text-xs text-muted-foreground">
                {truncateId(run.id)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{run.deviceName}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {run.scheduleName}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(run.startedAt)}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatDuration(run.startedAt, run.endedAt)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {run.totalFiles}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-green-600">
                {run.movedFiles}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {run.failedFiles > 0 ? (
                  <span className="text-red-600">{run.failedFiles}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatBytes(run.bytesCopied)}
              </TableCell>
              <TableCell>
                <StatusBadge status={run.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-muted-foreground">
            Showing {start}–{end} of {total} runs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
