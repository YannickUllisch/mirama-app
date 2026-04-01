import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Project',
  description: 'Update project specific information',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">{children}</div>
}

export default Layout
