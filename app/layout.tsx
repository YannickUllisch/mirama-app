import { ThemeProvider } from '@/src/components/ThemeProvider'
import './globals.css'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-white dark:bg-black">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main> {children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
export default RootLayout
