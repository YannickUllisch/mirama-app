import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Manage tenant-level access policies',
}

const PolicyLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default PolicyLayout
