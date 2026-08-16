// app/(app)/tenant/[tenantId]/roles/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Shield } from 'lucide-react'
import { Suspense } from 'react'
import IamManagerSkeleton from './_components/IamManagerSkeleton'
import { IamPageNav } from './_components/IamPageNav'
import { RolesManager } from './_components/RolesManager'

const RolesPage = () => (
  <div className="flex flex-col min-h-screen">
    <PageHeader
      title="Roles"
      icon={Shield}
      description="Manage access roles by scope"
    />
    <div className="flex-1 px-10 md:px-16 pb-10 space-y-5">
      <IamPageNav />
      <Suspense fallback={<IamManagerSkeleton />}>
        <RolesManager />
      </Suspense>
    </div>
  </div>
)

export default RolesPage
