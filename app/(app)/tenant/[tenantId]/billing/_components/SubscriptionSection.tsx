// app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSection.tsx
'use client'

import apiRequest from '@hooks'
import { Badge } from '@ui/badge'
import { Card, CardContent, CardHeader } from '@ui/card'
import { AlertTriangle } from 'lucide-react'
import { fmtDate, fmtPrice, statusStyles } from './billing-helpers'

const SubscriptionSection = () => {
  const { data: tenant, isLoading } = apiRequest.tenant.fetch.useQuery()

  if (isLoading) return null

  const sub = tenant?.subscription ?? null

  if (!sub) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-warning/30 bg-warning/8">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-ink">No active subscription</p>
          <p className="text-sm text-muted-foreground mt-0.5">
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
      label: 'Billing period',
      value: fmtDate(sub.periodStart),
      sub: `ends ${fmtDate(sub.periodEnd)}`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardHeader className="px-4 py-2.5 bg-surface-dark">
            <p className="text-xs font-medium text-white/60">{stat.label}</p>
          </CardHeader>
          <CardContent className="px-4 py-3.5">
            {stat.badge ? (
              <Badge
                variant="outline"
                className={`gap-1 text-[11px] ${stat.badge.className}`}
              >
                {stat.badge.label}
              </Badge>
            ) : (
              <p className="text-xl font-medium text-ink">{stat.value}</p>
            )}
            {stat.sub && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {stat.sub}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SubscriptionSection
