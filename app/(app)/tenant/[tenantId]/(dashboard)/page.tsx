// app/(app)/tenant/[tenantId]/(dashboard)/page.tsx
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Building2, PlusIcon } from 'lucide-react'
import { Suspense } from 'react'
import OrganizationGrid from './_components/OrganizationGrid'
import OrganizationGridSkeleton from './_components/OrganizationGridSkeleton'

const TenantPage = async ({
  params,
}: {
  params: Promise<{ tenantId: string }>
}) => {
  const { tenantId } = await params

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Organizations" icon={Building2}>
        <HoverLink href={`/tenant/${tenantId}/organization/create`}>
          <Button variant="tertiary" size={'sm'}>
            <PlusIcon className="w-3 h-3" />
            Create New Organizations
          </Button>
        </HoverLink>
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
