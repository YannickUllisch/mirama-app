// app/(app)/tenant/[tenantId]/billing/page.tsx
import PageHeader from '@src/components/PageHeader'
import { ArrowRight, CreditCard } from 'lucide-react'
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
        description="Subscription & Usage"
      />
      <div className="flex-1 px-4 py-5 space-y-4">
        <Suspense fallback={<SubscriptionSectionSkeleton />}>
          <SubscriptionSection />
        </Suspense>

        <Suspense fallback={<UsageSectionSkeleton />}>
          <UsageSection />
        </Suspense>

        {/* Plans CTA */}
        <div className="rounded-xl overflow-hidden bg-signature-mustard">
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Plans & Pricing</p>
              <p className="text-xs text-ink/60 mt-0.5">
                Compare all available plans and features
              </p>
            </div>
            <Link
              href="billing/plans"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-ink/70 transition-colors shrink-0"
            >
              View Plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
