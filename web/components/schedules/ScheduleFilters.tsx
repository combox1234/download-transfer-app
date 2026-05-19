'use client'

import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Device } from '@/lib/types/api'

interface ScheduleFiltersProps {
  devices: Device[]
  filters: { deviceId?: string; status?: string }
  onFilterChange: (filters: { deviceId?: string; status?: string }) => void
}

const statusOptions = ['All', 'Active', 'Paused'] as const

export default function ScheduleFilters({
  devices,
  filters,
  onFilterChange,
}: ScheduleFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={filters.deviceId || 'all'}
        onValueChange={(v) =>
          onFilterChange({
            ...filters,
            deviceId: v === 'all' ? undefined : v,
          })
        }
        options={[
          { value: 'all', label: 'All devices' },
          ...devices.map((d) => ({ value: d.id, label: d.deviceName })),
        ]}
        className="w-44"
      />
      <div className="flex rounded-lg border border-border overflow-hidden">
        {statusOptions.map((status) => {
          const isActive =
            (status === 'All' && !filters.status) ||
            filters.status === status
          return (
            <button
              key={status}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  status: status === 'All' ? undefined : status,
                })
              }
              className={cn(
                'px-3 py-1.5 text-sm transition-colors duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {status}
            </button>
          )
        })}
      </div>
    </div>
  )
}
