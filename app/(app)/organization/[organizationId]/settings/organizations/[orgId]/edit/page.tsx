// app/(app)/organization/[organizationId]/settings/organizations/[orgId]/edit/page.tsx
import PageHeader from '@src/components/PageHeader'
import OrganizationForm from '@src/modules/tenant/organization/components/OrganizationForm'
import OrganizationFormSkeleton from '@src/modules/tenant/organization/components/OrganizationFormSkeleton'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'

const EditOrganizationPage = async ({
  params,
}: {
  params: Promise<{ orgId: string; organizationId: string }>
}) => {
  const { orgId, organizationId } = await params
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Edit Organization"
        icon={Building2}
        description="Update organization details"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm
          orgId={orgId}
          returnHref={`/organization/${organizationId}/settings/organizations`}
        />
      </Suspense>
    </div>
  )
}

export default EditOrganizationPage
