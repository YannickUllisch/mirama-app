import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plans',
  description: 'Compare available subscription plans',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
