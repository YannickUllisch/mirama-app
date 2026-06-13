// app/(app)/tenant/[tenantId]/(dashboard)/_components/DashboardStats.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Progress } from '@ui/progress'
import { Skeleton } from '@ui/skeleton'
import { Building2, CreditCard, FolderOpen, Users } from 'lucide-react'

const isUnlimited = (n: number) => n <= 0 || n >= 999

const fmtPrice = (cents: number) =>
  cents === 0
    ? 'Free tier'
    : `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: cents % 100 !== 0 ? 2 : 0 })}/mo`

const progressColor = (p: number | null) => {
  if (p === null) return ''
  if (p >= 100) return '[&>div]:bg-lava'
  if (p >= 80) return '[&>div]:bg-[#FFAB00]'
  return '[&>div]:bg-success'
}

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
  const { data: orgs = [], isLoading: orgsLoading } =
    apiRequest.organization.fetchAll.useQuery()
  const { data: billingData, isLoading: billingLoading } =
    apiRequest.billing.fetchUsage.useQuery()

  if (orgsLoading || billingLoading) return <DashboardStatsSkeleton />

  const billing = billingData as BillingResponse | undefined
  const f = billing?.subscription?.plan.features
  const planName = billing?.subscription?.plan.name ?? 'Free'
  const planPrice = billing?.subscription?.plan.price ?? 0

  const orgMax = f?.maxOrganizations ?? -1
  const memberMax = f
    ? (f.maxOrganizations ?? 1) * (f.maxMembersPerOrg ?? -1)
    : -1
  const projectMax = f
    ? (f.maxOrganizations ?? 1) * (f.maxProjectsPerOrg ?? -1)
    : -1

  const totalMembers = orgs.reduce((s, o) => s + o._count.members, 0)
  const totalProjects = orgs.reduce((s, o) => s + o._count.projects, 0)

  const pct = (current: number, max: number): number | null => {
    if (isUnlimited(max)) return null
    return Math.min(100, Math.round((current / max) * 100))
  }

  const stats = [
    {
      label: 'Organizations',
      value: String(orgs.length),
      sub: isUnlimited(orgMax)
        ? 'Unlimited'
        : `${orgs.length} / ${orgMax} used`,
      Icon: Building2,
      pct: pct(orgs.length, orgMax),
    },
    {
      label: 'Total members',
      value: String(totalMembers),
      sub: isUnlimited(memberMax)
        ? 'Unlimited'
        : `${totalMembers} / ${memberMax} used`,
      Icon: Users,
      pct: pct(totalMembers, memberMax),
    },
    {
      label: 'Total projects',
      value: String(totalProjects),
      sub: isUnlimited(projectMax)
        ? 'Unlimited'
        : `${totalProjects} / ${projectMax} used`,
      Icon: FolderOpen,
      pct: pct(totalProjects, projectMax),
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
            <p className="text-[11px] text-white/35">{stat.sub}</p>
            {stat.pct !== null && (
              <Progress
                value={stat.pct}
                className={`h-0.5 mt-2 bg-white/10 ${progressColor(stat.pct)}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
