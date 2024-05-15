import { ThemeProvider } from '@/src/components/ThemeProvider'
import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start | Mirama',
  description: 'Entry Page for Management System',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-neutral-100 dark:bg-neutral-950">
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
