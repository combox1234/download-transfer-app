'use client'

import { FileText, CheckCircle, XCircle, HardDrive } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatBytes } from '@/lib/utils'
import type { BackupRun } from '@/lib/types/api'

interface RunSummaryCardsProps {
  run: BackupRun
}

export default function RunSummaryCards({ run }: RunSummaryCardsProps) {
  const cards = [
    {
      label: 'Total Files',
      value: run.totalFiles,
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Moved',
      value: run.movedFiles,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Failed',
      value: run.failedFiles,
      icon: XCircle,
      color: 'text-red-600 bg-red-50',
    },
    {
      label: 'Data Size',
      value: formatBytes(run.bytesCopied),
      icon: HardDrive,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.color.split(' ')[1]}`}>
                <card.icon className={`h-5 w-5 ${card.color.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
