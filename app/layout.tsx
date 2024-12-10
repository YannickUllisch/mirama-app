import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start | Mirama',
  description: 'Entry Page for Management System',
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-neutral-50 dark:bg-neutral-900/40">
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
