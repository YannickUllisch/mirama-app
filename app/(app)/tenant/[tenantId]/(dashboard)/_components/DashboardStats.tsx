// app/(app)/tenant/[tenantId]/(dashboard)/_components/DashboardStats.tsx
'use client'

import apiRequest from '@hooks'
import { Skeleton } from '@ui/skeleton'
import { Building2, CreditCard, FolderOpen, Users } from 'lucide-react'

const fmtPrice = (cents: number) =>
  cents === 0
    ? 'Free tier'
    : `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: cents % 100 !== 0 ? 2 : 0 })}/mo`

const DashboardStatsSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-6 w-36 rounded-full" />
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline rounded-xl border border-hairline overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5 py-4 space-y-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-8 w-10" />
        </div>
      ))}
    </div>
  </div>
)

const DashboardStats = () => {
  const { items: orgs, isLoading: orgsLoading } =
    apiRequest.organization.fetchAll.useQuery({ initialPageSize: 100 })
  const { data: tenant, isLoading: tenantLoading } =
    apiRequest.tenant.fetch.useQuery()

  if (orgsLoading || tenantLoading) return <DashboardStatsSkeleton />

  const planName = tenant?.subscription.plan.name ?? 'Free'
  const planPrice = tenant?.subscription.plan.price ?? 0

  const totalMembers = orgs.reduce((s, o) => s + o.memberCount, 0)
  const totalProjects = orgs.reduce((s, o) => s + o.projectCount, 0)

  const stats = [
    { label: 'Organizations', value: String(orgs.length), Icon: Building2 },
    { label: 'Total members', value: String(totalMembers), Icon: Users },
    { label: 'Total projects', value: String(totalProjects), Icon: FolderOpen },
  ]

  return (
    <div className="space-y-3">
      {/* Plan badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-soft border border-hairline">
        <CreditCard className="w-3 h-3 text-body-text" />
        <span className="text-xs font-medium text-ink">{planName}</span>
        <span className="w-px h-3 bg-hairline" />
        <span className="text-xs text-body-text">{fmtPrice(planPrice)}</span>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline rounded-xl border border-hairline overflow-hidden">
        {stats.map((stat) => (
          <div key={stat.label} className="px-5 py-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.5px] text-body-text">
                {stat.label}
              </span>
              <stat.Icon className="w-3.5 h-3.5 text-body-text/40" />
            </div>
            <p className="text-3xl font-[450] text-ink tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
