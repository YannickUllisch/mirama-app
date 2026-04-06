import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tenant Settings',
  description: 'Your Tenant Settings Overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
