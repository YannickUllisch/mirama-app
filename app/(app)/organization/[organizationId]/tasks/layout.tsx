import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Tasks',
  description: 'Overview of all personal Tasks',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">{children}</div>
}

export default Layout
