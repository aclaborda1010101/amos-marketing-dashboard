import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
