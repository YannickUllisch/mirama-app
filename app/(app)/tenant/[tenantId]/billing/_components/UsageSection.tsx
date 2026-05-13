// app/(app)/tenant/[tenantId]/billing/_components/UsageSection.tsx
'use client'

import apiRequest from '@hooks'
import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Progress } from '@ui/progress'
import { BarChart2, Building2, FolderOpen, Users } from 'lucide-react'
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
          className={`text-xs font-mono tabular-nums ${
            isFull
              ? 'text-signature-coral'
              : isWarn
                ? 'text-signature-mustard'
                : 'text-muted-foreground'
          }`}
        >
          {current}
          <span className="text-muted-foreground/40"> / </span>
          {unlimited ? '∞' : max}
        </span>
      </div>
      <Progress
        value={unlimited ? 0 : pct}
        className={`h-1.5 ${
          isFull
            ? '[&>div]:bg-signature-coral'
            : isWarn
              ? '[&>div]:bg-signature-mustard'
              : '[&>div]:bg-signature-mint'
        }`}
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
    <Card className="overflow-hidden">
      <CardHeader className="px-6 py-4 bg-signature-mint">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-ink">
          <BarChart2 className="w-4 h-4 text-ink/60" />
          Current Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
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
          max={
            f ? (f.maxOrganizations ?? 1) * (f.maxProjectsPerOrg ?? -1) : -1
          }
        />
      </CardContent>
    </Card>
  )
}

export default UsageSection
