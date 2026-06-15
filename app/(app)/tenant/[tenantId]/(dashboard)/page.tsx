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
    <div className="flex flex-col min-h-screen">
      <div className="bg-surface-dark px-6 md:px-10 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-white/35 mb-3">
            Workspace
          </p>
          <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight">
            Your organizations
          </h1>
          <p className="mt-2 text-sm text-white/50 max-w-md">
            Manage access, track usage, and enter any of your organizations
            below.
          </p>
          <div className="mt-7">
            <DashboardStats />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto space-y-7">
          <Suspense>
            <OrganizationGrid />
          </Suspense>
          <InvitationPanel />
        </div>
      </div>
    </div>
  )
}

export default TenantPage
