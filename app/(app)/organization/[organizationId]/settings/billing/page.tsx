import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { ArrowRight, CreditCard, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import SubscriptionSection from './_components/SubscriptionSection'
import SubscriptionSectionSkeleton from './_components/SubscriptionSectionSkeleton'
import UsageSection from './_components/UsageSection'
import UsageSectionSkeleton from './_components/UsageSectionSkeleton'

const BillingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Billing"
        icon={CreditCard}
        description="Subscription & usage"
      />

      <div className="flex-1 px-10 md:px-16 pb-10 space-y-6">
        <Suspense fallback={<SubscriptionSectionSkeleton />}>
          <SubscriptionSection />
        </Suspense>

        <Suspense fallback={<UsageSectionSkeleton />}>
          <UsageSection />
        </Suspense>

        {/* Plans CTA */}
        <div className="rounded-xl border border-hairline bg-canvas p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-dark">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Plans & pricing</p>
              <p className="text-xs text-body-text mt-0.5">
                Compare all available plans and features
              </p>
            </div>
          </div>
          <Button asChild variant="mirama" size="sm" className="shrink-0">
            <Link href="billing/plans">
              View plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
