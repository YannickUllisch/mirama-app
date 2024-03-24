import './globals.css'
import Header from '@/src/Header'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-white dark:bg-black">
        <Header />
        <main> {children}</main>
      </body>
    </html>
  )
}
export default RootLayout
