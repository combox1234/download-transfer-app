'use client'

import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Device, BackupSchedule } from '@/lib/types/api'

interface HistoryFiltersProps {
  devices: Device[]
  schedules: BackupSchedule[]
  filters: {
    deviceId?: string
    scheduleId?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }
  onFilterChange: (filters: HistoryFiltersProps['filters']) => void
}

export default function HistoryFilters({
  devices,
  schedules,
  filters,
  onFilterChange,
}: HistoryFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        type="date"
        value={filters.dateFrom || ''}
        onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value || undefined })}
        className="w-36 text-sm"
        placeholder="From"
      />
      <Input
        type="date"
        value={filters.dateTo || ''}
        onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value || undefined })}
        className="w-36 text-sm"
        placeholder="To"
      />
      <Select
        value={filters.deviceId || 'all'}
        onValueChange={(v) =>
          onFilterChange({ ...filters, deviceId: v === 'all' ? undefined : v })
        }
        options={[
          { value: 'all', label: 'All devices' },
          ...devices.map((d) => ({ value: d.id, label: d.deviceName })),
        ]}
        className="w-44"
      />
      <Select
        value={filters.status || 'all'}
        onValueChange={(v) =>
          onFilterChange({ ...filters, status: v === 'all' ? undefined : v })
        }
        options={[
          { value: 'all', label: 'All statuses' },
          { value: 'SUCCESS', label: 'Success' },
          { value: 'PARTIAL', label: 'Partial' },
          { value: 'FAILED', label: 'Failed' },
          { value: 'RUNNING', label: 'Running' },
        ]}
        className="w-36"
      />
      <Select
        value={filters.scheduleId || 'all'}
        onValueChange={(v) =>
          onFilterChange({ ...filters, scheduleId: v === 'all' ? undefined : v })
        }
        options={[
          { value: 'all', label: 'All schedules' },
          ...schedules.map((s) => ({
            value: s.id,
            label: s.sourceUri.split('/').pop() || s.id.slice(0, 8),
          })),
        ]}
        className="w-44"
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange({})}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
