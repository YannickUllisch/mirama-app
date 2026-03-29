import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Project',
  description: 'Fill out the form to create a new Project',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-[100vh]">{children}</div>
}

export default Layout
