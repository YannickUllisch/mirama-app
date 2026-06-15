// app/(app)/tenant/[tenantId]/organization/create/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Building2 } from 'lucide-react'
import { Suspense } from 'react'
import OrganizationForm from '../_components/OrganizationForm'
import OrganizationFormSkeleton from '../_components/OrganizationFormSkeleton'

const CreateOrganizationPage = async ({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) => {
  const { tenantId } = await params
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Create Organization"
        icon={Building2}
        description="Add a new organization to your tenant"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm tenantId={tenantId} />
      </Suspense>
    </div>
  )
}

export default CreateOrganizationPage
