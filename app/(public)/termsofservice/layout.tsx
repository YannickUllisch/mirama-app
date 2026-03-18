import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Mirama Terms of Service to understand your rights, responsibilities, and the conditions for using our platform. Review important legal information and user guidelines.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
