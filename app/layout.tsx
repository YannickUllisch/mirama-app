// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

/**
 * Inter — primary font loaded via Google Fonts.
 * NotionInter (a modified Inter used by Mirama) requires a local or CDN
 * install. Inter serves as the drop-in fallback via the --font-inter CSS var
 * referenced in globals.css.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Mirama',
  description:
    'Welcome to Mirama, a modern platform for project and task management. Discover powerful tools for teams and organizations to collaborate, organize, and achieve more.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={inter.variable}>
      <body className="bg-background">
        <Toaster />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
