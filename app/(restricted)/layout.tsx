import HeadersLayout from '@src/components/Header/Layout'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from '../loading'
import SessionWrapper from '@src/components/SessionWrapper'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <SessionWrapper>
        <HeadersLayout>{children}</HeadersLayout>
      </SessionWrapper>
    </Suspense>
  )
}
export default ProtectedLayout
