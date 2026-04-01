import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Your Tenant Billing Overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">{children}</div>
}

export default Layout
