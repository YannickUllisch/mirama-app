import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Tasks',
  description: 'Overview of Personal Tasks',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
