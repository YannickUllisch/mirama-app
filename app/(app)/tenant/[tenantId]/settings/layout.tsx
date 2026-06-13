// app/(app)/tenant/[tenantId]/settings/layout.tsx
import PageHeader from '@src/components/PageHeader'
import { Settings } from 'lucide-react'
import type { Metadata } from 'next'
import SettingsShell from './_components/SettingsShell'

export const metadata: Metadata = {
  title: 'Tenant Settings',
  description: 'Your Tenant Settings Overview',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Tenant configuration"
      />
      <SettingsShell>{children}</SettingsShell>
    </>
  )
}

export default Layout
