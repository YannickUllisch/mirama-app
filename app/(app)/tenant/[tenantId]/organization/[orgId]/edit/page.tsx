// app/(app)/tenant/[tenantId]/organization/[orgId]/edit/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'
import OrganizationForm from '../../_components/OrganizationForm'
import OrganizationFormSkeleton from '../../_components/OrganizationFormSkeleton'

const EditOrganizationPage = async ({
  params,
}: {
  params: Promise<{ orgId: string; tenantId: string }>
}) => {
  const { orgId, tenantId } = await params
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Edit Organization"
        icon={Building2}
        description="Update organization details"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm orgId={orgId} tenantId={tenantId} />
      </Suspense>
    </div>
  )
}

export default EditOrganizationPage
