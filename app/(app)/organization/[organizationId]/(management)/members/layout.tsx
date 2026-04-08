import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members & Roles',
  description: 'Manage organization and project member roles',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
