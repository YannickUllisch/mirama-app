import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'Edit your Task',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
