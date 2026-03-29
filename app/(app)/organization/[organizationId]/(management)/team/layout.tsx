import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
  description: 'Overview of Team',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
