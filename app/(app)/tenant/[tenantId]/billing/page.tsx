'use client'

import apiRequest from '@hooks/query'
import type {
  BillingResponse,
  PlanFeatures,
  PlanResponse,
} from '@server/modules/billing/features/response'
import PageHeader from '@src/components/PageHeader'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Progress } from '@ui/progress'
import { Separator } from '@ui/separator'
import { Skeleton } from '@ui/skeleton'
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FolderOpen,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'
import { DateTime } from 'luxon'

const statusConfig: Record<
  string,
  { label: string; variant: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    label: 'Active',
    variant:
      'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  TRIALING: {
    label: 'Trial',
    variant:
      'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400',
    icon: <Zap className="w-3 h-3" />,
  },
  PAST_DUE: {
    label: 'Past Due',
    variant:
      'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  CANCELED: {
    label: 'Canceled',
    variant:
      'text-neutral-500 border-neutral-200 bg-neutral-50 dark:bg-neutral-950/30 dark:border-neutral-700 dark:text-neutral-400',
    icon: <XCircle className="w-3 h-3" />,
  },
  UNPAID: {
    label: 'Unpaid',
    variant:
      'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400',
    icon: <XCircle className="w-3 h-3" />,
  },
}

const formatPrice = (cents: number, interval: string) =>
  `€${(cents / 100).toFixed(0)}/${interval === 'year' ? 'yr' : 'mo'}`

// ── Sub-components ─────────────────────────────────────────────────────────

const UsageBar = ({
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
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0
  const isNearLimit = pct >= 80
  const isAtLimit = pct >= 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-medium">
          {icon}
          {label}
        </span>
        <span
          className={`text-xs font-mono tabular-nums ${
            isAtLimit
              ? 'text-rose-500'
              : isNearLimit
                ? 'text-amber-500'
                : 'text-neutral-400'
          }`}
        >
          {current}
          <span className="text-neutral-300 dark:text-neutral-600"> / </span>
          {max === -1 ? '∞' : max}
        </span>
      </div>
      <Progress
        value={max === -1 ? 0 : pct}
        className={`h-1.5 ${
          isAtLimit
            ? '[&>div]:bg-rose-500'
            : isNearLimit
              ? '[&>div]:bg-amber-400'
              : ''
        }`}
      />
    </div>
  )
}

const FeatureItem = ({
  label,
  enabled,
}: {
  label: string
  enabled: boolean
}) => (
  <div className="flex items-center gap-2 text-sm">
    {enabled ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-neutral-300 dark:text-neutral-600 shrink-0" />
    )}
    <span
      className={
        enabled
          ? 'text-neutral-700 dark:text-neutral-300'
          : 'text-neutral-400 dark:text-neutral-600 line-through'
      }
    >
      {label}
    </span>
  </div>
)

const PlanCard = ({
  plan,
  isCurrent,
}: {
  plan: PlanResponse
  isCurrent: boolean
}) => {
  const f: PlanFeatures = plan.features

  return (
    <div
      className={`relative rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
        isCurrent
          ? 'border-primary bg-primary/5 dark:bg-primary/10'
          : 'border-border hover:border-primary/40'
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-2.5 left-4">
          <Badge className="text-[10px] px-2 py-0.5 gap-1 bg-primary text-primary-foreground">
            <BadgeCheck className="w-3 h-3" />
            Current Plan
          </Badge>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">{plan.name}</h3>
          <span className="text-lg font-black tabular-nums">
            {plan.price === 0 ? (
              <span className="text-neutral-400">Free</span>
            ) : (
              formatPrice(plan.price, plan.interval)
            )}
          </span>
        </div>
        {plan.description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            {plan.description}
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-2 flex-1">
        <FeatureItem
          label={`${f.maxOrganizations} organization${f.maxOrganizations !== 1 ? 's' : ''}`}
          enabled
        />
        <FeatureItem
          label={`${f.maxMembersPerOrg} members per organization`}
          enabled
        />
        <FeatureItem
          label={`${f.maxProjectsPerOrg} projects per organization`}
          enabled
        />
        <FeatureItem label="API Access" enabled={f.apiAccess} />
        <FeatureItem label="Advanced Reporting" enabled={f.advancedReporting} />
        <FeatureItem label="Priority Support" enabled={f.prioritySupport} />
      </div>

      {!isCurrent && (
        <Button
          variant={plan.price === 0 ? 'outline' : 'default'}
          size="sm"
          className="w-full mt-auto"
          disabled
        >
          {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
          <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      )}
    </div>
  )
}

// ── Skeleton layout for loading state ──────────────────────────────────────

const BillingSkeleton = () => (
  <div className="flex-1 px-6 md:px-10 py-6 space-y-8">
    <Skeleton className="h-36 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-72 rounded-xl" />
      ))}
    </div>
  </div>
)

// ── No-subscription state ──────────────────────────────────────────────────

const NoPlanBanner = () => (
  <div className="flex items-start gap-3 p-5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20">
    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
        No active subscription
      </p>
      <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">
        Your tenant is running on default limits. Select a plan below to unlock
        higher limits and additional features.
      </p>
    </div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────────────

const BillingPage = () => {
  const { data, isLoading } = apiRequest.billing.fetchOverview.useQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader
          title="Billing"
          icon={CreditCard}
          description="Subscription & Usage"
        />
        <BillingSkeleton />
      </div>
    )
  }

  const billing = data as BillingResponse | undefined
  const sub = billing?.subscription ?? null
  const usage = billing?.usage ?? { organizations: 0, members: 0, projects: 0 }
  const plans = billing?.plans ?? []
  const currentPlanFeatures = sub?.plan.features

  const statusInfo = sub
    ? (statusConfig[sub.status] ?? statusConfig.ACTIVE)
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Billing"
        icon={CreditCard}
        description="Subscription & Usage"
      />

      <div className="flex-1 px-6 md:px-10 py-6 space-y-8">
        {!sub && <NoPlanBanner />}

        {/* ── Current Plan Card ── */}
        {sub && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{sub.plan.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`gap-1 text-[11px] ${statusInfo?.variant ?? ''}`}
                    >
                      {statusInfo?.icon}
                      {statusInfo?.label}
                    </Badge>
                    {sub.cancelAtPeriodEnd && (
                      <Badge
                        variant="outline"
                        className="text-[11px] text-amber-600 border-amber-200"
                      >
                        Cancels at period end
                      </Badge>
                    )}
                  </div>
                  {sub.plan.description && (
                    <p className="text-xs text-neutral-400">
                      {sub.plan.description}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black tabular-nums">
                    {sub.plan.price === 0
                      ? 'Free'
                      : formatPrice(sub.plan.price, sub.plan.interval)}
                  </p>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Period:{' '}
                  {DateTime.fromJSDate(new Date(sub.periodStart)).toFormat(
                    'd MMM yyyy',
                  )}
                  {' – '}
                  {DateTime.fromJSDate(new Date(sub.periodEnd)).toFormat(
                    'd MMM yyyy',
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {sub.cancelAtPeriodEnd
                    ? `Ends ${DateTime.fromJSDate(new Date(sub.periodEnd)).toFormat('d MMM yyyy')}`
                    : `Renews ${DateTime.fromJSDate(new Date(sub.periodEnd)).toFormat('d MMM yyyy')}`}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Usage Metrics ── */}
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-neutral-700 dark:text-neutral-300 mb-4">
            Current Usage
          </h2>
          <Card>
            <CardContent className="pt-5 space-y-6">
              <UsageBar
                label="Organizations"
                icon={<Building2 className="w-3.5 h-3.5" />}
                current={usage.organizations}
                max={currentPlanFeatures?.maxOrganizations ?? -1}
              />
              <UsageBar
                label="Members (total across all orgs)"
                icon={<Users className="w-3.5 h-3.5" />}
                current={usage.members}
                max={
                  currentPlanFeatures
                    ? (currentPlanFeatures.maxOrganizations ?? 1) *
                      (currentPlanFeatures.maxMembersPerOrg ?? -1)
                    : -1
                }
              />
              <UsageBar
                label="Projects (total across all orgs)"
                icon={<FolderOpen className="w-3.5 h-3.5" />}
                current={usage.projects}
                max={
                  currentPlanFeatures
                    ? (currentPlanFeatures.maxOrganizations ?? 1) *
                      (currentPlanFeatures.maxProjectsPerOrg ?? -1)
                    : -1
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Plans ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
              {plans.length > 0 ? 'Available Plans' : 'Plans'}
            </h2>
            <p className="text-xs text-neutral-400">
              Upgrade/downgrade coming soon
            </p>
          </div>

          {plans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={sub?.plan.id === plan.id}
                />
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <CreditCard className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-sm font-medium text-neutral-500">
                No plans configured
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Contact your administrator to set up billing plans.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default BillingPage
