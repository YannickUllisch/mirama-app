// app/(app)/tenant/[tenantId]/billing/plans/page.tsx
import PageHeader from '@src/components/PageHeader'
import { LayoutGrid } from 'lucide-react'
import { Suspense } from 'react'
import PlansGrid from './_components/PlansGrid'
import PlansGridSkeleton from './_components/PlansGridSkeleton'

const PlansPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Plans"
        icon={LayoutGrid}
        description="Compare & Choose"
      />
      <Suspense fallback={<PlansGridSkeleton />}>
        <PlansGrid />
      </Suspense>
    </div>
  )
}

export default PlansPage
