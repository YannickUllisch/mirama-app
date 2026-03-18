import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set Password',
  description:
    'Choose a secure password to complete your Mirama account setup. Protect your account and gain access to all project management features.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
