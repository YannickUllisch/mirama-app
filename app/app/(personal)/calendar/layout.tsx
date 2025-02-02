import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar | Mirama',
  description: 'Calendar view of your projects',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
