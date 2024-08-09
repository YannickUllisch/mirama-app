import { ThemeProvider } from '@src/components/ThemeProvider'
import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/SwrProvider'
import Footer from '@src/components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Start | Mirama',
  description: 'Entry Page for Management System',
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-white dark:bg-neutral-900/10">
        <Toaster />
        <SwrProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </SwrProvider>
      </body>
    </html>
  )
}

export default RootLayout
