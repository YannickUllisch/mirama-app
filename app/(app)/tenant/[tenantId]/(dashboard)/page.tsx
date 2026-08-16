// app/(app)/tenant/[tenantId]/(dashboard)/page.tsx
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
    <div className="bg-surface-soft min-h-full px-10 md:px-16 py-10">
      {/* Page title row */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-ink leading-tight">
          Your organizations
        </h1>
        <p className="mt-1.5 text-sm text-body-text">
          Manage access, track usage, and enter any of your organizations below.
        </p>
      </div>

      <div className="space-y-6">
        <DashboardStats />

        <Suspense>
          <OrganizationGrid />
        </Suspense>

        <InvitationPanel />
      </div>
    </div>
  )
}

export default TenantPage
