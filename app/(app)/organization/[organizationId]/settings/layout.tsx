// app/(app)/organization/[organizationId]/settings/layout.tsx
import TenantResourceBridge from '@src/modules/tenant/tenant/TenantResourceBridge'
import type { Metadata } from 'next'
import SettingsMobileHeader from './_components/SettingsMobileHeader'
import SettingsSidebar from './_components/SettingsSidebar'
import SettingsSidebarProvider from './_components/SettingsSidebarProvider'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Workspace and account settings',
}

const SettingsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationId: string }>
}) => {
  const { organizationId } = await params

  return (
    <TenantResourceBridge>
      <SettingsSidebarProvider>
        <SettingsSidebar organizationId={organizationId} />
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <SettingsMobileHeader />
          <div className="flex-1 overflow-y-auto bg-surface-soft">
            <div className="mx-auto px-6 sm:px-10 md:px-16 py-8 md:py-10 max-w-2xl">
              {children}
            </div>
          </div>
        </div>
      </SettingsSidebarProvider>
    </TenantResourceBridge>
  )
}

export default SettingsLayout
