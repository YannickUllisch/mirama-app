import PageHeader from '@src/components/PageHeader'
import OrganizationForm from '@src/modules/tenant/organization/components/OrganizationForm'
import OrganizationFormSkeleton from '@src/modules/tenant/organization/components/OrganizationFormSkeleton'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'

const CreateOrganizationPage = async ({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) => {
  const { organizationId } = await params
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Create Organization"
        icon={Building2}
        description="Add a new organization to your tenant"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm
          returnHref={`/organization/${organizationId}/settings/organizations`}
        />
      </Suspense>
    </div>
  )
}

export default CreateOrganizationPage
