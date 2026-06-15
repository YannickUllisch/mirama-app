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
  <div className="space-y-4">
    <Skeleton className="h-7 w-40 rounded-full bg-white/10" />
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-xl border border-white/10 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5 py-5 space-y-2.5">
          <Skeleton className="h-2.5 w-24 bg-white/10" />
          <Skeleton className="h-9 w-10 bg-white/10" />
          <Skeleton className="h-2 w-28 bg-white/10" />
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
    {
      label: 'Organizations',
      value: String(orgs.length),
      Icon: Building2,
    },
    {
      label: 'Total members',
      value: String(totalMembers),
      Icon: Users,
    },
    {
      label: 'Total projects',
      value: String(totalProjects),
      Icon: FolderOpen,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
        <CreditCard className="w-3 h-3 text-white/50" />
        <span className="text-xs font-medium text-white/70">{planName}</span>
        <span className="w-px h-3 bg-white/20" />
        <span className="text-xs text-white/40">{fmtPrice(planPrice)}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-xl border border-white/10 overflow-hidden">
        {stats.map((stat) => (
          <div key={stat.label} className="px-5 py-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.5px] text-white/40">
                {stat.label}
              </span>
              <stat.Icon className="w-3.5 h-3.5 text-white/20" />
            </div>
            <p className="text-3xl font-medium text-white tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
