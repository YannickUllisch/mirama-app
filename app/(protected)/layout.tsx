'use client'
import Header from '@/src/components/Header/Header'
import Sidebar from '@/src/components/Header/Sidebar'
import { SessionProvider } from 'next-auth/react'
import { useState } from 'react'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <>
      <SessionProvider>
        <div className="flex  h-full items-start justify-start">
          {isSidebarExpanded ? <Sidebar /> : null}
          <div className="w-full">
            <Header
              toggleSidebar={() =>
                setIsSidebarExpanded((prevState) => !prevState)
              }
            />
            {children}
          </div>
        </div>
      </SessionProvider>
    </>
  )
}
export default ProtectedLayout
