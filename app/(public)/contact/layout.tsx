import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Us Form',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
