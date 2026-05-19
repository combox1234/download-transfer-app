'use client'

import { Badge } from '@/components/ui/badge'
import type { RunStatus, FileLogStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: RunStatus | FileLogStatus
  dot?: boolean
  className?: string
}

const statusConfig: Record<
  string,
  { variant: 'success' | 'destructive' | 'warning' | 'default' | 'secondary'; label: string; dotColor: string }
> = {
  SUCCESS: { variant: 'success', label: 'Success', dotColor: 'bg-green-500' },
  FAILED: { variant: 'destructive', label: 'Failed', dotColor: 'bg-red-500' },
  PARTIAL: { variant: 'warning', label: 'Partial', dotColor: 'bg-amber-500' },
  RUNNING: { variant: 'default', label: 'Running', dotColor: 'bg-blue-500' },
  SKIPPED: { variant: 'secondary', label: 'Skipped', dotColor: 'bg-gray-400' },
  DUPLICATE: { variant: 'secondary', label: 'Duplicate', dotColor: 'bg-amber-400' },
}

export default function StatusBadge({ status, dot = false, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.SKIPPED

  if (dot) {
    return (
      <span
        className={cn(
          'inline-block h-3 w-3 rounded-full shrink-0',
          config.dotColor,
          status === 'RUNNING' && 'animate-pulse',
          className
        )}
        title={config.label}
      />
    )
  }

  return (
    <Badge
      variant={config.variant}
      dot={status === 'RUNNING'}
      dotColor={status === 'RUNNING' ? 'bg-blue-500 animate-pulse' : undefined}
      className={className}
    >
      {config.label}
    </Badge>
  )
}
