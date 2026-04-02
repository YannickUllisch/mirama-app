import { IamManager } from '@src/components/(application)/tenant/iam/IamManager'
import PageHeader from '@src/components/PageHeader'
import { Shield } from 'lucide-react'

const RolesPage = () => (
  <div className="flex flex-col min-h-screen">
    <PageHeader
      title="Roles & Policies"
      icon={Shield}
      description="Identity & Access Management"
    />
    <div className="flex-1 px-6 md:px-10 py-6">
      <IamManager scope={{ type: 'tenant' }} />
    </div>
  </div>
)

export default RolesPage
