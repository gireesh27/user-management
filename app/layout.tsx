import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Regress APP',
  description: 'Created by Gireesh',
  generator: 'gireesh',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
