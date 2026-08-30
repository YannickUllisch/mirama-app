// app/(app)/portal/organization/create/page.tsx
import { auth } from '@auth'
import PageHeader from '@src/components/PageHeader'
import OrganizationForm from '@src/modules/tenant/organization/components/OrganizationForm'
import OrganizationFormSkeleton from '@src/modules/tenant/organization/components/OrganizationFormSkeleton'
import { TenantResourceProvider } from '@src/modules/tenant/tenant/tenantResourceContext'
import { Building2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const CreateOrganizationPage = async () => {
  const session = await auth()
  if (!session?.user.tenantId) redirect('/auth/login')

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Create Organization"
        icon={Building2}
        description="Add a new organization to your tenant"
      />
      <TenantResourceProvider value={{ activeTenantId: session.user.tenantId }}>
        <Suspense fallback={<OrganizationFormSkeleton />}>
          <OrganizationForm returnHref="/portal" />
        </Suspense>
      </TenantResourceProvider>
    </div>
  )
}

export default CreateOrganizationPage
