import * as React from 'react'
import { cn } from '@/lib/utils'

function Avatar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split('@')[0]
    .split(/[._-]/)
    .map((part) => part[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('')
}

export { Avatar, AvatarFallback, getInitials }
