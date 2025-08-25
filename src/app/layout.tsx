import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import AppLayout from '@/components/AppLayout'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'D2R Holy Grail Tracker',
  description: 'Track and share your Diablo II: Resurrected Holy Grail progress',
  keywords: 'Diablo 2, D2R, Holy Grail, progress tracking, achievements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}