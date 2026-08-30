import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'My projects overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
