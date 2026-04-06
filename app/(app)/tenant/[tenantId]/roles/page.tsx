// app/(app)/tenant/[tenantId]/roles/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Shield } from 'lucide-react'
import { Suspense } from 'react'
import { IamManager } from './_components/IamManager'
import IamManagerSkeleton from './_components/IamManagerSkeleton'

const RolesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) => {
  const { tab } = await searchParams
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Roles & Policies"
        icon={Shield}
        description="Identity & Access Management"
      />
      <div className="flex-1 px-6 md:px-10 py-6">
        <Suspense fallback={<IamManagerSkeleton />}>
          <IamManager defaultTab={tab} />
        </Suspense>
      </div>
    </div>
  )
}

export default RolesPage
