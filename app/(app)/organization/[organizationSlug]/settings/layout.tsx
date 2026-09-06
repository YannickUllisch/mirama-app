// app/(app)/organization/[organizationSlug]/settings/layout.tsx
import { SidebarInset } from '@src/components/ui/sidebar'
import TenantResourceBridge from '@src/modules/tenant/tenant/TenantResourceBridge'
import type { Metadata } from 'next'
import SettingsMobileHeader from './_components/SettingsMobileHeader'
import SettingsSidebar from './_components/SettingsSidebar'
import SettingsSidebarProvider from './_components/SettingsSidebarProvider'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Workspace and account settings',
}

// Only builds navigation hrefs (SettingsSidebar/SettingsBackLink), so the route's slug is
// all it needs - membership/access is already verified one level up by the parent
// [organizationSlug] layout's resolveActiveOrganization() call.
const SettingsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationSlug: string }>
}) => {
  const { organizationSlug } = await params

  return (
    <TenantResourceBridge>
      <SettingsSidebarProvider>
        <SettingsSidebar organizationSlug={organizationSlug} />
        <SidebarInset className="min-w-0 overflow-hidden transition-[margin,border-radius] duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)] lg:my-2 lg:mr-2 lg:rounded-xl lg:peer-data-[state=collapsed]:ml-2">
          <SettingsMobileHeader />
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto px-6 sm:px-10 md:px-16 py-8 md:py-10 max-w-4xl">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SettingsSidebarProvider>
    </TenantResourceBridge>
  )
}

export default SettingsLayout
