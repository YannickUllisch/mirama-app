import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'My projects overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-[100vh]">{children}</div>
}

export default Layout
