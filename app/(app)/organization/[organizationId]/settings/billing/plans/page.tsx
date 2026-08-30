// app/(app)/organization/[organizationId]/settings/billing/plans/page.tsx
import PageHeader from '@src/components/PageHeader'
import { LayoutGrid } from 'lucide-react'
import { Suspense } from 'react'
import PlansGrid from './_components/PlansGrid'
import PlansGridSkeleton from './_components/PlansGridSkeleton'

const PlansPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Plans & Pricing"
        icon={LayoutGrid}
        description="Compare & choose a subscription"
      />
      <Suspense fallback={<PlansGridSkeleton />}>
        <PlansGrid />
      </Suspense>
    </div>
  )
}

export default PlansPage
