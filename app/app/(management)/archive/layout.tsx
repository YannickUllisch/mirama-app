import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archived Projects | Mirama',
  description: 'View of all archived projects',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
