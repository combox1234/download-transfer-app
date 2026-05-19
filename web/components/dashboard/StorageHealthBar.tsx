'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { formatBytes } from '@/lib/utils'

interface StorageDevice {
  deviceId: string
  deviceName: string
  bytesCopied30Days: number
}

interface StorageHealthBarProps {
  devices: StorageDevice[]
  isLoading: boolean
}

export default function StorageHealthBar({ devices, isLoading }: StorageHealthBarProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No device data available
      </p>
    )
  }

  const maxBytes = Math.max(...devices.map((d) => d.bytesCopied30Days), 1)

  return (
    <div className="space-y-4">
      {devices.map((device) => {
        const percent = (device.bytesCopied30Days / maxBytes) * 100
        return (
          <div key={device.deviceId}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">
                {device.deviceName}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatBytes(device.bytesCopied30Days)}
              </span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(percent, 2)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
