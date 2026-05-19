import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AutoBackup Manager',
  description: 'AutoBackup Manager — automated file backup for Android devices',
}

export const viewport = {
  themeColor: '#6366F1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
