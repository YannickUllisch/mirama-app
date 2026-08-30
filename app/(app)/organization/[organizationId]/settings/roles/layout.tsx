import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roles & Policies',
  description: 'Manage tenant-level roles',
}

const RolesLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default RolesLayout
