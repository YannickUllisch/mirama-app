import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const dmMono = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Mirama',
  description:
    'Welcome to Mirama, a modern platform for project and task management. Discover powerful tools for teams and organizations to collaborate, organize, and achieve more.',
}
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={dmMono.variable}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className="bg-background">
        <Toaster />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
