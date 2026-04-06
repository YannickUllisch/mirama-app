// app/(app)/tenant/[tenantId]/(dashboard)/page.tsx
import PageHeader from '@src/components/PageHeader'
import CreateOrganizationDialog from '@src/modules/tenant/components/dialogs/CreateOrganizationDialog'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'
import OrganizationGrid from './_components/OrganizationGrid'
import OrganizationGridSkeleton from './_components/OrganizationGridSkeleton'

const TenantPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Organizations" icon={Building2}>
        <CreateOrganizationDialog />
      </PageHeader>

      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        <Suspense fallback={<OrganizationGridSkeleton />}>
          <OrganizationGrid />
        </Suspense>
      </div>
    </div>
  )
}

export default TenantPage
