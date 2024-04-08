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
            <main className="flex items-center flex-col h-screen mt-2">
              <div className="w-11/12 h-5/6 shadow-sm bg-white dark:bg-neutral-900/50 p-10 rounded-xl ">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SessionProvider>
    </>
  )
}
export default ProtectedLayout
