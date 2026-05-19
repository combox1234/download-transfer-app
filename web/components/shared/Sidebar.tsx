'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  CalendarClock,
  History,
  Smartphone,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback, getInitials } from '@/components/ui/avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/api/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/schedules', icon: CalendarClock, label: 'Schedules' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/devices', icon: Smartphone, label: 'Devices' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: '#0F1117' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#6366F1]">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-white font-semibold text-base tracking-tight">
            AutoBackup
          </span>
          <span className="block text-[#52525B] text-[11px] font-medium -mt-0.5">
            Manager
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-2 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group relative',
                active
                  ? 'text-[#6366F1] font-medium'
                  : 'text-[#A1A1AA] hover:text-white'
              )}
              style={
                active
                  ? { background: 'rgba(99,102,241,0.12)' }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLElement).style.background =
                    'rgba(255,255,255,0.06)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  ;(e.currentTarget as HTMLElement).style.background = ''
                }
              }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#6366F1]" />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 px-3 py-4 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-[#6366F1] text-white">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#A1A1AA] hover:text-red-400 transition-colors duration-150 p-1.5 rounded-md hover:bg-white/5"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md border border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-200',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 z-40">
        {sidebarContent}
      </aside>
    </>
  )
}
