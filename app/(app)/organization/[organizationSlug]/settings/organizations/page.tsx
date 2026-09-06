// app/(app)/organization/[organizationSlug]/settings/organizations/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'
import DashboardStats from './_components/DashboardStats'
import InvitationPanel from './_components/InvitationPanel'
import OrganizationGrid from './_components/OrganizationGrid'

const OrganizationsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Organizations"
        icon={Building2}
        description="Manage access, track usage, and enter any of your organizations"
      />
      <div className="flex-1 px-10 md:px-16 pb-10 space-y-6">
        <DashboardStats />

        <Suspense>
          <OrganizationGrid />
        </Suspense>

        <InvitationPanel />
      </div>
    </div>
  )
}

export default OrganizationsPage
