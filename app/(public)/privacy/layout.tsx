import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Discover how Mirama collects, uses and protects your personal information. Review our privacy practices, data handling policies, and your rights as a user.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
