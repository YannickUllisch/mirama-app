import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Your calendar view over projects and events',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">{children}</div>
}

export default Layout
