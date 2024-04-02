import Header from '@/src/components/Header/Header'
import Sidebar from '@/src/components/Header/Sidebar'
import { SessionProvider } from 'next-auth/react'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <div className="flex items-start justify-start">
          <Sidebar />

          <div className="w-full h-full">
            <Header />
            {children}
          </div>
        </div>
      </SessionProvider>
    </>
  )
}
export default ProtectedLayout
