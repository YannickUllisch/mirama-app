import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Access your Mirama account securely. Log in to manage projects, collaborate with your team, and stay organized across your workspace.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
