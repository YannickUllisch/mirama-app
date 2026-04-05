import PageHeader from '@src/components/PageHeader'
import { IamManager } from '@src/modules/tenant/iam/components/IamManager'
import { Shield } from 'lucide-react'

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
        <IamManager scope={{ type: 'tenant' }} defaultTab={tab} />
      </div>
    </div>
  )
}

export default RolesPage
