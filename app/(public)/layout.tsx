'use server'
import { auth } from '@server/auth/auth'
import Footer from '@src/components/Footer/Footer'
import PublicHeader from '@src/components/Header/PublicHeader'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <>
      <PublicHeader session={session} />
      <div className="min-h-svh ">{children}</div>
      <Footer />
    </>
  )
}

export default Layout
