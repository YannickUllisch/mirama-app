// app/(app)/organization/[organizationId]/(management)/teams/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Users2 } from 'lucide-react'
import { Suspense } from 'react'
import TeamsContent from './_components/TeamsContent'
import TeamsPageSkeleton from './_components/TeamsPageSkeleton'

const TeamsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Teams"
        description="Manage organization teams and members"
        icon={Users2}
      />
      <Suspense fallback={<TeamsPageSkeleton />}>
        <TeamsContent />
      </Suspense>
    </div>
  )
}

export default TeamsPage
