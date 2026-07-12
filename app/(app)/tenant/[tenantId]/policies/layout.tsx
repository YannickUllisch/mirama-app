import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Manage tenant-level access policies',
}

const PolicyLayout = ({ children }: { children: React.ReactNode }) => (
  <NuqsAdapter>{children}</NuqsAdapter>
)

export default PolicyLayout
