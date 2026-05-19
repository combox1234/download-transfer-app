'use client'

import { useState } from 'react'
import {
  Smartphone,
  Wifi,
  WifiOff,
  CalendarClock,
  History,
  Trash2,
} from 'lucide-react'
import Header from '@/components/shared/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useDevices } from '@/lib/hooks/useDevices'
import { deleteDevice } from '@/lib/api/devices'
import { formatRelativeTime } from '@/lib/utils'

export default function DevicesPage() {
  const { devices, isLoading, mutate } = useDevices()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteDevice(deleteTarget)
    setDeleteTarget(null)
    mutate()
  }

  const isOnline = (lastSeen: string) => {
    return Date.now() - new Date(lastSeen).getTime() < 3600 * 1000
  }

  const deleteDevice_ = devices.find((d) => d.id === deleteTarget)

  return (
    <>
      <Header title="Devices" />
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <Smartphone className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No devices connected</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Install the AutoBackup Manager app on your Android device and sign in to connect.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {devices.map((device) => {
              const online = isOnline(device.lastSeenAt)
              return (
                <Card
                  key={device.id}
                  className="hover:shadow-md transition-shadow duration-150"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-lg">
                          <Smartphone className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {device.deviceName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            {online ? (
                              <Badge
                                variant="success"
                                dot
                                dotColor="bg-green-500"
                              >
                                Online
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                dot
                                dotColor="bg-gray-400"
                              >
                                Offline
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(device.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {online ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-gray-400" />
                        )}
                        <span>
                          Last seen{' '}
                          {formatRelativeTime(device.lastSeenAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span>
                          {device.activeSchedulesCount} active schedule
                          {device.activeSchedulesCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <History className="h-4 w-4" />
                        <span>
                          {device.totalRunsCount} total run
                          {device.totalRunsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Delete dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Device</DialogTitle>
              <DialogDescription>
                Remove &ldquo;{deleteDevice_?.deviceName}&rdquo; from your account?
                This will also remove all associated schedules. Backup history will be preserved.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
