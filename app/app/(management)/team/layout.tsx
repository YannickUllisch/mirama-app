import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team | Mirama',
  description: 'Overview of Team',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
