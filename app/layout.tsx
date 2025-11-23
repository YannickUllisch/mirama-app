import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import './globals.css'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'

const dmMono = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'], // Adjust weights as needed
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Mirama',
  description: 'Landing Page',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={dmMono.variable}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-background">
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
