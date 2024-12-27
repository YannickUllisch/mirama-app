import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieConsent from '@src/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Start | Mirama',
  description: 'Entry Page for Management System',
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-neutral-50 dark:bg-neutral-900/40">
        <NextTopLoader zIndex={99999} color="#F43F5E" showSpinner={false} />
        <Toaster />
        <SpeedInsights />
        <CookieConsent />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
