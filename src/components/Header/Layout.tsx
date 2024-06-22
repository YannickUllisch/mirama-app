'use client'
import React, { type PropsWithChildren, useState, type FC } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from '@/src/components/Footer/Footer'

const HeadersLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  return (
    <>
      <div className="flex min-h-screen items-start justify-start">
        {isSidebarExpanded ? <Sidebar /> : null}
        <div className="w-full">
          <Header
            toggleSidebar={() =>
              setIsSidebarExpanded((prevState) => !prevState)
            }
          />
          <main className="flex h-full items-center flex-col">
            <div className="w-full h-full bg-inherit p-8">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HeadersLayout
