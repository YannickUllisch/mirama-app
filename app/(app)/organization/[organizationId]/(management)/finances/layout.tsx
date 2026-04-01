import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Finances',
  description: 'Company Finance Management',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">{children}</div>
}

export default Layout
