// app/(app)/organization/[organizationId]/(management)/teams/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teams',
  description: 'Manage organization teams and their members',
}

const Layout = ({ children }: { children: React.ReactNode }) => children

export default Layout
