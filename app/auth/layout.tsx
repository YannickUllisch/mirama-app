import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | Mirama',
  description: 'Sign In/Up Menu',
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-background">{children}</div>
}

export default AuthLayout
