import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description:
    'Recover access to your Mirama account. Request a password reset link and follow the instructions to securely set a new password.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
