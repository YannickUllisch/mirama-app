// app/(app)/tenant/[tenantId]/(dashboard)/page.tsx
import PageHeader from '@src/components/PageHeader'
import { LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'
import DashboardStats from './_components/DashboardStats'
import InvitationPanel from './_components/InvitationPanel'
import OrganizationGrid from './_components/OrganizationGrid'

const TenantPage = async ({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) => {
  await params

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Workspace"
        icon={LayoutDashboard}
        description="Overview & organizations"
      />

      <div className="flex-1 px-6 py-6 space-y-5">
        <DashboardStats />
        <InvitationPanel />
        <Suspense>
          <OrganizationGrid />
        </Suspense>
      </div>
    </div>
  )
}

export default TenantPage
