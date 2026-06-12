// app/(app)/tenant/[tenantId]/(dashboard)/_components/DashboardStats.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Card } from '@ui/card'
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
  <Card className="overflow-hidden rounded-xl">
    <div className="px-5 py-3.5 bg-surface-dark">
      <Skeleton className="h-4 w-44 bg-white/15" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5 py-4 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      ))}
    </div>
  </Card>
)

const DashboardStats = () => {
  const { data: orgs = [], isLoading: orgsLoading } =
    apiRequest.organization.fetchAll.useQuery()
  const { data: billingData, isLoading: billingLoading } =
    apiRequest.billing.fetchOverview.useQuery()

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
      label: 'Total Members',
      value: String(totalMembers),
      sub: isUnlimited(memberMax)
        ? 'Unlimited'
        : `${totalMembers} / ${memberMax} used`,
      Icon: Users,
      pct: pct(totalMembers, memberMax),
    },
    {
      label: 'Total Projects',
      value: String(totalProjects),
      sub: isUnlimited(projectMax)
        ? 'Unlimited'
        : `${totalProjects} / ${projectMax} used`,
      Icon: FolderOpen,
      pct: pct(totalProjects, projectMax),
    },
  ]

  return (
    <Card className="overflow-hidden rounded-xl">
      <div className="px-5 py-3.5 bg-surface-dark flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-3.5 h-3.5 text-white/50" />
          <span className="text-sm font-medium text-white">{planName}</span>
        </div>
        <span className="text-xs text-white/50">{fmtPrice(planPrice)}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {stats.map((stat) => {
          const p = stat.pct
          return (
            <div key={stat.label} className="px-5 py-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
                <stat.Icon className="w-3.5 h-3.5 text-muted-foreground/50" />
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
              {p !== null && (
                <Progress
                  value={p}
                  className={`h-1 mt-1 ${progressColor(p)}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default DashboardStats
