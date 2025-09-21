import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Complete Scaffold Demo',
  description: 'A complete scaffold demo application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
