import PageHeader from '@src/components/PageHeader'
import { Users } from 'lucide-react'
import { Suspense } from 'react'
import MembersContent from './_components/MembersContent'
import MembersPageSkeleton from './_components/MembersPageSkeleton'

const MembersPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Members & Roles"
        description="Manage organization and project member roles"
        icon={Users}
      />
      <Suspense fallback={<MembersPageSkeleton />}>
        <MembersContent />
      </Suspense>
    </div>
  )
}

export default MembersPage
