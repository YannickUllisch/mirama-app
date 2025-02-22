import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { DM_Sans } from 'next/font/google'

const dmMono = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'], // Adjust weights as needed
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Start | Mirama',
  description: 'Entry Page for Management System',
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={dmMono.variable}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-background">
        <NextTopLoader zIndex={99999} color="#FF5F46" showSpinner={false} />
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
