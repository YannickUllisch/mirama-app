'use server'
import InfoFooter from '@src/components/Footer/InfoFooter'
import PublicHeader from '@src/components/Header/PublicHeader'
import { auth } from '@auth'
import Footer from '@src/components/Footer/Footer'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <div className="bg-light-gradient dark:bg-dark-gradient">
      <PublicHeader session={session} />
      <div className="min-h-svh ">{children}</div>
      {/* <InfoFooter /> */}
      <Footer />
    </div>
  )
}

export default Layout
