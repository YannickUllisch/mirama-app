// app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSection.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Badge } from '@ui/badge'
import { AlertTriangle } from 'lucide-react'
import { fmtDate, fmtPrice, statusStyles } from './billing-helpers'

const SubscriptionSection = () => {
  const { data, isLoading } = apiRequest.billing.fetchOverview.useQuery()

  if (isLoading) return null

  const billing = data as BillingResponse | undefined
  const sub = billing?.subscription ?? null

  if (!sub) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            No active subscription
          </p>
          <p className="text-xs text-amber-600/80 dark:text-amber-500/70 mt-0.5">
            Your tenant is running on default limits. Choose a plan to get
            started.
          </p>
        </div>
      </div>
    )
  }

  const status = statusStyles[sub.status] ?? statusStyles.ACTIVE

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="rounded-xl border border-border p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Plan
        </p>
        <p className="text-xl font-bold tracking-tight mt-1">{sub.plan.name}</p>
        {sub.cancelAtPeriodEnd && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Cancels {fmtDate(sub.periodEnd)}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Cost
        </p>
        <p className="text-xl font-bold tracking-tight mt-1">
          {fmtPrice(sub.plan.price)}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {sub.plan.price > 0 ? `per ${sub.plan.interval}` : 'No charge'}
        </p>
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Status
        </p>
        <div className="mt-1.5">
          <Badge
            variant="outline"
            className={`gap-1 text-[11px] ${status.className}`}
          >
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Billing Period
        </p>
        <p className="text-xl font-bold tracking-tight mt-1">
          {fmtDate(sub.periodStart)}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          to {fmtDate(sub.periodEnd)}
        </p>
      </div>
    </div>
  )
}

export default SubscriptionSection
