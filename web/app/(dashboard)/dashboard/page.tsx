'use client'

import { CalendarClock, History, TrendingUp, HardDrive } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Header from '@/components/shared/Header'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentRunsTable from '@/components/dashboard/RecentRunsTable'
import StorageHealthBar from '@/components/dashboard/StorageHealthBar'
import FailedTransfersBanner from '@/components/dashboard/FailedTransfersBanner'
import { useStats } from '@/lib/hooks/useStats'
import { useBackupRuns } from '@/lib/hooks/useBackupRuns'
import { formatSuccessRate, formatBytes } from '@/lib/utils'

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useStats()
  const { runs, isLoading: runsLoading } = useBackupRuns({ size: 10 })

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Schedules"
            value={stats.activeSchedules}
            subtitle={`of ${stats.totalSchedules} total`}
            icon={CalendarClock}
            status={stats.activeSchedules > 0 ? 'good' : 'warn'}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Runs (30 days)"
            value={stats.last30DaysRuns}
            icon={History}
            status="neutral"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Success Rate"
            value={formatSuccessRate(stats.successRate)}
            icon={TrendingUp}
            status={
              stats.successRate >= 0.9
                ? 'good'
                : stats.successRate >= 0.7
                  ? 'warn'
                  : 'danger'
            }
            isLoading={statsLoading}
          />
          <StatsCard
            title="Data Backed Up"
            value={formatBytes(stats.totalBytesCopiedLast30Days)}
            subtitle="last 30 days"
            icon={HardDrive}
            status="neutral"
            isLoading={statsLoading}
          />
        </div>

        {/* Failed transfers banner */}
        <FailedTransfersBanner count={stats.failedTransfersPending} />

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentRunsTable runs={runs.slice(0, 10)} isLoading={runsLoading} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Storage by Device</CardTitle>
            </CardHeader>
            <CardContent>
              <StorageHealthBar
                devices={stats.storageHealthByDevice}
                isLoading={statsLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
