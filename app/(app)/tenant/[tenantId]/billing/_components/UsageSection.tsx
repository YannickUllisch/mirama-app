// app/(app)/tenant/[tenantId]/billing/_components/UsageSection.tsx
'use client'

import apiRequest from '@hooks/query'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Progress } from '@ui/progress'
import { Building2, FolderOpen, Users } from 'lucide-react'
import { isUnlimited } from './billing-helpers'

const UsageRow = ({
  label,
  icon,
  current,
  max,
}: {
  label: string
  icon: React.ReactNode
  current: number
  max: number
}) => {
  const unlimited = isUnlimited(max)
  const pct = unlimited ? 0 : Math.min(100, Math.round((current / max) * 100))
  const isWarn = pct >= 80
  const isFull = pct >= 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground font-medium">
          {icon}
          {label}
        </span>
        <span
          className={`text-xs font-mono tabular-nums ${isFull ? 'text-rose-500' : isWarn ? 'text-amber-500' : 'text-muted-foreground'}`}
        >
          {current}
          <span className="text-muted-foreground/40"> / </span>
          {unlimited ? '∞' : max}
        </span>
      </div>
      <Progress
        value={unlimited ? 0 : pct}
        className={`h-1.5 ${isFull ? '[&>div]:bg-rose-500' : isWarn ? '[&>div]:bg-amber-400' : ''}`}
      />
    </div>
  )
}

const UsageSection = () => {
  const { data, isLoading } = apiRequest.billing.fetchOverview.useQuery()

  if (isLoading) return null

  const billing = data as BillingResponse | undefined
  const usage = billing?.usage ?? { organizations: 0, members: 0, projects: 0 }
  const f = billing?.subscription?.plan.features

  return (
    <div className="rounded-xl border border-border p-5 space-y-5">
      <p className="text-sm font-semibold tracking-tight">Current Usage</p>
      <UsageRow
        label="Organizations"
        icon={<Building2 className="w-3.5 h-3.5" />}
        current={usage.organizations}
        max={f?.maxOrganizations ?? -1}
      />
      <UsageRow
        label="Members (across all orgs)"
        icon={<Users className="w-3.5 h-3.5" />}
        current={usage.members}
        max={f ? (f.maxOrganizations ?? 1) * (f.maxMembersPerOrg ?? -1) : -1}
      />
      <UsageRow
        label="Projects (across all orgs)"
        icon={<FolderOpen className="w-3.5 h-3.5" />}
        current={usage.projects}
        max={f ? (f.maxOrganizations ?? 1) * (f.maxProjectsPerOrg ?? -1) : -1}
      />
    </div>
  )
}

export default UsageSection
