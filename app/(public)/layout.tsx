'use server'
import PublicHeader from '@src/components/Header/PublicHeader'
import { auth } from '@auth'
import Footer from '@src/components/Footer/Footer'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <div>
      <PublicHeader session={session} />
      <div className="min-h-svh ">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
