'use client'

import { useState } from 'react'
import Header from '@/components/shared/Header'
import { Card } from '@/components/ui/card'
import HistoryFilters from '@/components/history/HistoryFilters'
import HistoryTable from '@/components/history/HistoryTable'
import { useBackupRuns } from '@/lib/hooks/useBackupRuns'
import { useDevices } from '@/lib/hooks/useDevices'
import { useSchedules } from '@/lib/hooks/useSchedules'

export default function HistoryPage() {
  const [filters, setFilters] = useState<{
    deviceId?: string
    scheduleId?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }>({})
  const [page, setPage] = useState(0)
  const { runs, total, isLoading } = useBackupRuns(filters, page)
  const { devices } = useDevices()
  const { schedules } = useSchedules()

  return (
    <>
      <Header title="Backup History" />
      <div className="p-6 space-y-4">
        <HistoryFilters
          devices={devices}
          schedules={schedules}
          filters={filters}
          onFilterChange={(f) => {
            setFilters(f)
            setPage(0)
          }}
        />
        <Card>
          <div className="p-1">
            <HistoryTable
              runs={runs}
              isLoading={isLoading}
              total={total}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </Card>
      </div>
    </>
  )
}
