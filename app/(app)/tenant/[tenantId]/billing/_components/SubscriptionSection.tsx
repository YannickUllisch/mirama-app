// app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSection.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Badge } from '@ui/badge'
import { Card, CardContent, CardHeader } from '@ui/card'
import { AlertTriangle } from 'lucide-react'
import { fmtDate, fmtPrice, statusStyles } from './billing-helpers'

const STAT_COLORS = [
  { header: 'bg-signature-coral', text: 'text-white', sub: 'text-white/65' },
  { header: 'bg-signature-mustard', text: 'text-ink', sub: 'text-ink/60' },
  { header: 'bg-signature-mint', text: 'text-ink', sub: 'text-ink/60' },
  { header: 'bg-signature-forest', text: 'text-white', sub: 'text-white/65' },
]

const SubscriptionSection = () => {
  const { data, isLoading } = apiRequest.billing.fetchOverview.useQuery()

  if (isLoading) return null

  const billing = data as BillingResponse | undefined
  const sub = billing?.subscription ?? null

  if (!sub) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-signature-peach/40 bg-signature-peach/10">
        <AlertTriangle className="w-4 h-4 text-signature-coral shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-signature-coral">
            No active subscription
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your tenant is running on default limits. Choose a plan to get
            started.
          </p>
        </div>
      </div>
    )
  }

  const status = statusStyles[sub.status] ?? statusStyles.ACTIVE

  const stats = [
    {
      label: 'Plan',
      value: sub.plan.name,
      sub: sub.cancelAtPeriodEnd ? `Cancels ${fmtDate(sub.periodEnd)}` : null,
    },
    {
      label: 'Cost',
      value: fmtPrice(sub.plan.price),
      sub: sub.plan.price > 0 ? `per ${sub.plan.interval}` : 'No charge',
    },
    {
      label: 'Status',
      value: null,
      badge: status,
      sub: null,
    },
    {
      label: 'Billing Period',
      value: fmtDate(sub.periodStart),
      sub: `to ${fmtDate(sub.periodEnd)}`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const c = STAT_COLORS[i]
        return (
          <Card key={stat.label} className="overflow-hidden">
            <CardHeader className={`px-4 py-2.5 ${c.header}`}>
              <p className={`text-xs font-medium ${c.sub}`}>{stat.label}</p>
            </CardHeader>
            <CardContent className="px-4 py-3">
              {stat.badge ? (
                <div className="mt-0.5">
                  <Badge
                    variant="outline"
                    className={`gap-1 text-[11px] ${stat.badge.className}`}
                  >
                    {stat.badge.label}
                  </Badge>
                </div>
              ) : (
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              )}
              {stat.sub && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default SubscriptionSection
