'use client'
import React, { type PropsWithChildren, useState, type FC } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const HeadersLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  return (
    <div className="flex  h-full items-start justify-start">
      {isSidebarExpanded ? (
        <div>
          <Sidebar />
        </div>
      ) : null}
      <div className="w-full">
        <Header
          toggleSidebar={() => setIsSidebarExpanded((prevState) => !prevState)}
        />
        <main className="flex items-center flex-col h-screen">
          <div className="w-full h-full bg-white dark:bg-neutral-900/50 p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default HeadersLayout
