import HeadersLayout from '@/src/components/Header/Layout'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <HeadersLayout>{children}</HeadersLayout>
      </SessionProvider>
    </>
  )
}
export default ProtectedLayout
