import Header from '@/src/components/Header/Header'
import { SessionProvider } from 'next-auth/react'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <Header />
        {children}
      </SessionProvider>
    </>
  )
}
export default ProtectedLayout
