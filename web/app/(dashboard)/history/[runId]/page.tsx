'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import Header from '@/components/shared/Header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RunSummaryCards from '@/components/history/RunSummaryCards'
import FileLogTable from '@/components/history/FileLogTable'
import StatusBadge from '@/components/shared/StatusBadge'
import { useBackupRun } from '@/lib/hooks/useBackupRuns'
import { useFileLogs } from '@/lib/hooks/useFileLogs'
import { retryAllFailed } from '@/lib/api/runs'
import { truncateId, formatDate, formatDuration } from '@/lib/utils'
import type { FileLogStatus } from '@/lib/types/api'

export default function RunDetailPage() {
  const params = useParams()
  const runId = params.runId as string
  const { run, isLoading: runLoading } = useBackupRun(runId)
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [filePage, setFilePage] = useState(0)

  const fileStatus: FileLogStatus | undefined =
    activeTab === 'ALL' ? undefined : (activeTab as FileLogStatus)

  const { logs, total: fileTotal, isLoading: filesLoading } = useFileLogs(
    runId,
    fileStatus,
    filePage
  )

  const handleRetryAll = async () => {
    await retryAllFailed(runId)
  }

  if (runLoading) {
    return (
      <>
        <Header title="Run Detail" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    )
  }

  if (!run) {
    return (
      <>
        <Header title="Run Detail" />
        <div className="p-6">
          <p className="text-muted-foreground">Run not found</p>
        </div>
      </>
    )
  }

  const skippedCount = run.totalFiles - run.movedFiles - run.failedFiles

  return (
    <>
      <Header
        title={`Run ${truncateId(run.id)}`}
        action={<StatusBadge status={run.status} />}
      />
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/history" className="hover:text-foreground transition-colors">
            History
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{truncateId(run.id)}</span>
        </div>

        {/* Run info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Device: <span className="text-foreground font-medium">{run.deviceName}</span></span>
          <span>Schedule: <span className="text-foreground font-medium">{run.scheduleName}</span></span>
          <span>Started: <span className="text-foreground">{formatDate(run.startedAt)}</span></span>
          <span>Duration: <span className="text-foreground">{formatDuration(run.startedAt, run.endedAt)}</span></span>
        </div>

        {/* Summary cards */}
        <RunSummaryCards run={run} />

        {/* Error banner */}
        {(run.status === 'FAILED' || run.status === 'PARTIAL') && run.errorMessage && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Backup error</p>
              <p className="text-sm mt-1 font-mono">{run.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Tab bar + retry */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v)
              setFilePage(0)
            }}
          >
            <TabsList>
              <TabsTrigger value="ALL">All ({run.totalFiles})</TabsTrigger>
              <TabsTrigger value="FAILED">Failed ({run.failedFiles})</TabsTrigger>
              <TabsTrigger value="SKIPPED">
                Skipped ({Math.max(0, skippedCount)})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {run.failedFiles > 0 && (
            <Button variant="outline" size="sm" onClick={handleRetryAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry All Failed
            </Button>
          )}
        </div>

        {/* File log table */}
        <Card>
          <div className="p-1">
            <FileLogTable
              logs={logs}
              isLoading={filesLoading}
              total={fileTotal}
              page={filePage}
              onPageChange={setFilePage}
            />
          </div>
        </Card>
      </div>
    </>
  )
}
