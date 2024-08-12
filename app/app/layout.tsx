import { Suspense } from 'react'
import Loading from '../loading'
import SessionWrapper from '@src/components/SessionWrapper'
import Sidebar from '@src/components/Sidebar/Sidebar'
import AppHeader from '@src/components/Header/AppHeader'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/SwrProvider'
import Footer from '@src/components/Footer/Footer'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <SwrProvider>
        <div className="grid grid-cols-[auto_1fr] min-h-screen">
          <div className="relative hidden md:block border-r-2 min-w-[210px] border-neutral-100 dark:border-neutral-800">
            <Sidebar />
          </div>
          <div className="flex flex-col">
            <AppHeader />
            <div className="flex-1 p-8  min-h-[700px]">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
            <Footer />
          </div>
        </div>
      </SwrProvider>
    </SessionWrapper>
  )
}

export default AppLayout
