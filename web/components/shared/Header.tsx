'use client'

import * as React from 'react'

interface HeaderProps {
  title: string
  action?: React.ReactNode
}

export default function Header({ title, action }: HeaderProps) {
  return (
    <header className="border-b border-border bg-white h-16 flex items-center px-6 shrink-0">
      <div className="flex items-center justify-between w-full">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
