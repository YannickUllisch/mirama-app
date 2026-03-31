import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roles & Policies',
  description: 'Manage tenant-level roles and access policies',
}

const RolesLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default RolesLayout
