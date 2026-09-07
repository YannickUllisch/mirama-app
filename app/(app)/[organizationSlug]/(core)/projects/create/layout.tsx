import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Project',
  description: 'Fill out the form to create a new Project',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
