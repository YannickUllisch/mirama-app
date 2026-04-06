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
      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        <Suspense fallback={<SubscriptionSectionSkeleton />}>
          <SubscriptionSection />
        </Suspense>

        <Suspense fallback={<UsageSectionSkeleton />}>
          <UsageSection />
        </Suspense>

        <div className="flex items-center justify-between rounded-xl border border-border p-5">
          <div>
            <p className="text-sm font-semibold tracking-tight">
              Plans & Pricing
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compare all available plans and features
            </p>
          </div>
          <Link
            href="billing/plans"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View Plans
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
