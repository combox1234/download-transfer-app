'use client'

import {
  CheckCircle,
  XCircle,
  MinusCircle,
  Copy,
  Image as ImageIcon,
  Film,
  FileText,
  Package,
  File,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
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
import { formatBytes, formatRelativeTime } from '@/lib/utils'
import type { FileLog, FileLogStatus } from '@/lib/types/api'

interface FileLogTableProps {
  logs: FileLog[]
  isLoading: boolean
  total: number
  page: number
  pageSize?: number
  onPageChange: (page: number) => void
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp']
  const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx', 'md', 'csv']
  const apkExts = ['apk']

  if (imageExts.includes(ext)) return <ImageIcon className="h-4 w-4 text-indigo-500" />
  if (videoExts.includes(ext)) return <Film className="h-4 w-4 text-purple-500" />
  if (docExts.includes(ext)) return <FileText className="h-4 w-4 text-blue-500" />
  if (apkExts.includes(ext)) return <Package className="h-4 w-4 text-orange-500" />
  return <File className="h-4 w-4 text-gray-400" />
}

const statusIcons: Record<FileLogStatus, React.ReactNode> = {
  SUCCESS: <CheckCircle className="h-4 w-4 text-green-500" />,
  FAILED: <XCircle className="h-4 w-4 text-red-500" />,
  SKIPPED: <MinusCircle className="h-4 w-4 text-gray-400" />,
  DUPLICATE: <Copy className="h-4 w-4 text-amber-500" />,
}

export default function FileLogTable({
  logs,
  isLoading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: FileLogTableProps) {
  if (isLoading) {
    return <SkeletonTable rows={8} cols={5} />
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No files in this category</p>
      </div>
    )
  }

  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, total)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead className="hidden md:table-cell">Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Error</TableHead>
            <TableHead className="hidden md:table-cell">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(log.fileName)}
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {log.fileName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatBytes(log.fileSize)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5" title={log.status}>
                  {statusIcons[log.status]}
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {log.status.charAt(0) + log.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {log.errorCode ? (
                  <span className="font-mono text-xs text-red-600">
                    {log.errorCode}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {formatRelativeTime(log.transferredAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total > pageSize && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-muted-foreground">
            Showing {start}–{end} of {total} files
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
