// app/(app)/tenant/[tenantId]/organization/[orgId]/edit/page.tsx
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Building2, ChevronLeft } from 'lucide-react'
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
      <HoverLink href={`/tenant/${tenantId}`}>
        <Button variant="link" className="text-xs w-fit">
          <ChevronLeft className="w-3 h-3" />
          Back to Organizations
        </Button>
      </HoverLink>
      <PageHeader
        title="Edit Organization"
        icon={Building2}
        description="Update organization details"
      />
      <Suspense fallback={<OrganizationFormSkeleton />}>
        <OrganizationForm orgId={orgId} />
      </Suspense>
    </div>
  )
}

export default EditOrganizationPage
