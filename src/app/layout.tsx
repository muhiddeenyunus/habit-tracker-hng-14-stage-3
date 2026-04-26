import type { Metadata, Viewport } from 'next'
import './globals.css'
import ServiceWorkerRegister from '@/components/shared/ServiceWorkerRegister'

export const metadata: Metadata = {
  title:       'Habit Tracker',
  description: 'Track your daily habits and build streaks',
  manifest:    '/manifest.json',
  appleWebApp: {
    capable:           true,
    statusBarStyle:    'default',
    title:             'Habit Tracker',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor:    '#528554',
  width:         'device-width',
  initialScale:  1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
