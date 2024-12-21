import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Mirama',
  description: 'Contact Us Form',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
