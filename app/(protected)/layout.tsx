import HeadersLayout from '@/src/components/Header/Layout'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import SessionWrapper from '@/src/components/SessionWrapper'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionWrapper>
      <HeadersLayout>
        <Suspense fallback={<Loading />}>{children} </Suspense>
      </HeadersLayout>
    </SessionWrapper>
  )
}
export default ProtectedLayout
