'use client'
import React, { type PropsWithChildren, useState, type FC } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const HeadersLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  return (
    <main className="flex min-h-screen">
      {isSidebarExpanded ? <Sidebar /> : null}
      <div className="flex flex-col w-full">
        <Header
          toggleSidebar={() => setIsSidebarExpanded((prevState) => !prevState)}
        />
        <div className="flex-1 flex flex-col">
          <div className="w-full flex-1 bg-inherit p-8 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default HeadersLayout
