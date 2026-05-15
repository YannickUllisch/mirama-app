// app/(app)/tenant/[tenantId]/(dashboard)/_components/DashboardStats.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Card, CardContent, CardHeader } from '@ui/card'
import { Progress } from '@ui/progress'
import { Skeleton } from '@ui/skeleton'
import { Building2, CreditCard, FolderOpen, Users } from 'lucide-react'

const isUnlimited = (n: number) => n <= 0 || n >= 999

const fmtPrice = (cents: number) =>
  cents === 0
    ? 'Free tier'
    : `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: cents % 100 !== 0 ? 2 : 0 })}/mo`

const STAT_COLORS = [
  { header: 'bg-signature-coral', sub: 'text-white/70', icon: 'text-white/60' },
  { header: 'bg-signature-mustard', sub: 'text-ink/65', icon: 'text-ink/50' },
  { header: 'bg-signature-mint', sub: 'text-ink/65', icon: 'text-ink/50' },
  {
    header: 'bg-signature-forest',
    sub: 'text-white/70',
    icon: 'text-white/60',
  },
]

const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {STAT_COLORS.map((c, i) => (
      <div
        key={`stat-skel-${i}`}
        className="rounded-xl border border-border overflow-hidden"
      >
        <div className={`px-4 py-2.5 ${c.header} opacity-20`}>
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="px-4 py-3 space-y-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>
    ))}
  </div>
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

  const progressColor = (p: number | null) => {
    if (p === null) return ''
    if (p >= 100) return '[&>div]:bg-signature-coral'
    if (p >= 80) return '[&>div]:bg-signature-mustard'
    return '[&>div]:bg-signature-mint'
  }

  const stats = [
    {
      label: 'Current Plan',
      value: planName,
      sub: fmtPrice(planPrice),
      Icon: CreditCard,
      pct: null,
    },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const c = STAT_COLORS[i]
        const p = stat.pct

        return (
          <Card key={stat.label} className="overflow-hidden">
            <CardHeader className={`px-4 py-2.5 ${c.header}`}>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-medium ${c.sub}`}>{stat.label}</p>
                <stat.Icon className={`w-3.5 h-3.5 ${c.icon}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 py-3 space-y-1.5">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
              {p !== null && (
                <Progress
                  value={p}
                  className={`h-1 mt-1 ${progressColor(p)}`}
                />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default DashboardStats
