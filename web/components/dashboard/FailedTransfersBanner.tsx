'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FailedTransfersBannerProps {
  count: number
}

export default function FailedTransfersBanner({ count }: FailedTransfersBannerProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          {count} failed transfer{count !== 1 ? 's' : ''} need attention
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          These files were not backed up in the last run
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/history?status=FAILED">Review</Link>
      </Button>
    </div>
  )
}
