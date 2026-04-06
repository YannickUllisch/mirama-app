// app/(app)/tenant/[tenantId]/organization/create/page.tsx
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Building2, ChevronLeft } from 'lucide-react'
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
      <HoverLink href={`/tenant/${tenantId}`} prefetch={false}>
        <Button variant="link" className="text-xs w-fit">
          <ChevronLeft className="w-3 h-3" />
          Back to Organizations
        </Button>
      </HoverLink>
      <PageHeader
        title="Create Organization"
        icon={Building2}
        description="Add a new organization to your tenant"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm />
      </Suspense>
    </div>
  )
}

export default CreateOrganizationPage
