// app/(app)/organization/[organizationId]/layout.tsx
import { auth } from '@auth'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import PermissionGate from '@src/modules/tenant/iam/PermissionGate'
import { OrganizationResourceProvider } from '@src/modules/tenant/organization/organizationResourceContext'
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
  params: Promise<{ organizationId: string }>
}) => {
  const session = await auth()
  const { organizationId } = await params

  if (!session?.user.tenantId) {
    redirect('/auth/login')
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <OrganizationResourceProvider
          value={{
            activeOrganizationId: organizationId,
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
