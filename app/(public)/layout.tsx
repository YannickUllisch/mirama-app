'use server'
import InfoFooter from '@src/components/Footer/InfoFooter'
import PublicHeader from '@src/components/Header/PublicHeader'
import { auth } from '@auth'
import Footer from '@src/components/Footer/Footer'
import dynamic from 'next/dynamic'

// const LenisProvider = dynamic(
//   () => import('@src/components/Wrappers/LenisWrapper'),
//   { ssr: false },
// )

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <div className="bg-light-gradient dark:bg-dark-gradient">
      {/* <LenisProvider> */}
      <PublicHeader session={session} />
      <div className="min-h-svh ">{children}</div>
      <InfoFooter />
      <Footer />
      {/* </LenisProvider> */}
    </div>
  )
}

export default Layout
