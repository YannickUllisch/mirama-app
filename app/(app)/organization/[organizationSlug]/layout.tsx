// app/(app)/organization/[organizationSlug]/layout.tsx
import { auth } from '@auth'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import PermissionGate from '@src/modules/tenant/iam/PermissionGate'
import { OrganizationResourceProvider } from '@src/modules/tenant/organization/organizationResourceContext'
import { resolveActiveOrganization } from '@src/modules/tenant/organization/organization.server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'App Dashboard',
}

const AppLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationSlug: string }>
}) => {
  const session = await auth()

  if (!session?.user.tenantId) {
    redirect('/auth/login')
  }

  const { organizationSlug } = await params
  const { organizationId, organizationSlug: resolvedSlug } =
    await resolveActiveOrganization(organizationSlug)

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <OrganizationResourceProvider
          value={{
            activeOrganizationId: organizationId,
            activeOrganizationSlug: resolvedSlug,
            activeTenantId: session?.user.tenantId ?? '',
          }}
        >
          <PermissionGate organizationId={organizationId}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              {children}
            </ThemeProvider>
          </PermissionGate>
        </OrganizationResourceProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}
export default AppLayout
