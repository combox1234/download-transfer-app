'use client'

import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  status?: 'good' | 'warn' | 'danger' | 'neutral'
  isLoading?: boolean
}

const statusStyles = {
  good: { bg: 'bg-green-50', icon: 'text-green-600' },
  warn: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  danger: { bg: 'bg-red-50', icon: 'text-red-600' },
  neutral: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = 'neutral',
  isLoading = false,
}: StatsCardProps) {
  const styles = statusStyles[status]

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-150">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-full', styles.bg)}>
            <Icon className={cn('h-6 w-6', styles.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
