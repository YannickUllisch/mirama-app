// app/(app)/tenant/[tenantId]/policies/page.tsx
import PageHeader from '@src/components/PageHeader'
import { FileText } from 'lucide-react'
import { IamPageNav } from '../roles/_components/IamPageNav'
import { PoliciesManager } from './_components/PoliciesManager'

const PoliciesPage = () => (
  <div className="flex flex-col min-h-screen">
    <PageHeader
      title="Policies"
      icon={FileText}
      description="Manage access policies by scope"
    />
    <div className="flex-1 px-10 md:px-16 pb-10 space-y-5">
      <IamPageNav />
      <PoliciesManager />
    </div>
  </div>
)

export default PoliciesPage
