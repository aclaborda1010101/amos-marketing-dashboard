import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AMOS v2.0 - Marketing Dashboard',
  description: 'Autonomous Marketing Operating System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        <Sidebar />
        <main className="lg:pl-64">
          {children}
        </main>
      </body>
    </html>
  )
}
