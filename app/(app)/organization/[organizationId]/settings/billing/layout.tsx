import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Your Tenant Billing Overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
