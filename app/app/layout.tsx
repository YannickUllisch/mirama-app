import { Suspense } from 'react'
import Loading from '../loading'
import SessionWrapper from '@src/components/SessionWrapper'
import AppHeader from '@src/components/Header/AppHeader'
import type { Metadata } from 'next'
import SwrProvider from '@src/components/SwrProvider'
import Footer from '@src/components/Footer/Footer'
import { auth } from '@src/lib/auth'
import Sidebar from '@src/components/Sidebar/Sidebar'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  return (
    <SessionWrapper>
      <SwrProvider>
        <div className="grid md:grid-cols-[auto_1fr] min-h-screen">
          <Sidebar session={session} />
          <div className="m-2 flex flex-col p-1 rounded-lg shadow-sm dark:shadow-neutral-900 bg-white dark:bg-neutral-900 border border-hover">
            <AppHeader />
            <div className="flex-1 p-6 min-h-[700px]">
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
