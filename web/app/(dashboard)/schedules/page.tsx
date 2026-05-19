'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import Header from '@/components/shared/Header'
import ScheduleCard from '@/components/schedules/ScheduleCard'
import ScheduleFilters from '@/components/schedules/ScheduleFilters'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/lib/hooks/useSchedules'
import { useDevices } from '@/lib/hooks/useDevices'
import { toggleSchedule, deleteSchedule } from '@/lib/api/schedules'

export default function SchedulesPage() {
  const [filters, setFilters] = useState<{ deviceId?: string; status?: string }>({})
  const { devices } = useDevices()

  // Convert status filter to isEnabled
  const apiFilters = {
    deviceId: filters.deviceId,
    isEnabled: filters.status === 'Active' ? true : filters.status === 'Paused' ? false : undefined,
  }
  const { schedules, isLoading, mutate } = useSchedules(apiFilters)

  const handleToggle = async (id: string) => {
    await toggleSchedule(id)
    mutate()
  }

  const handleDelete = async (id: string) => {
    await deleteSchedule(id)
    mutate()
  }

  return (
    <>
      <Header title="Schedules" />
      <div className="p-6">
        <ScheduleFilters
          devices={devices}
          filters={filters}
          onFilterChange={setFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <CalendarClock className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No schedules yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add backup schedules from the AutoBackup Manager Android app to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
