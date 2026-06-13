// app/(app)/tenant/[tenantId]/billing/plans/_components/PlansGrid.tsx
'use client'

import apiRequest from '@hooks'
import type {
  BillingResponse,
  PlanResponse,
} from '@server/modules/account/tenant/billing/features/response'
import { Separator } from '@ui/separator'
import { Check, Loader2, X } from 'lucide-react'
import { fmtPrice, isUnlimited } from '../../_components/billing-helpers'
import PlanCard from '../../_components/PlanCard'

type FeatureRow = {
  label: string
  getValue: (plan: PlanResponse) => React.ReactNode
}

const boolCell = (v: boolean) =>
  v ? (
    <Check className="w-4 h-4 text-success-border mx-auto" />
  ) : (
    <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
  )

const numCell = (n: number) => (
  <span className="text-sm font-medium tabular-nums">
    {isUnlimited(n) ? 'Unlimited' : n}
  </span>
)

const featureRows: FeatureRow[] = [
  {
    label: 'Price',
    getValue: (p) => (
      <span className="text-sm font-medium">
        {fmtPrice(p.price)}
        {p.price > 0 && (
          <span className="text-xs font-normal text-muted-foreground">
            /{p.interval === 'year' ? 'yr' : 'mo'}
          </span>
        )}
      </span>
    ),
  },
  {
    label: 'Organizations',
    getValue: (p) => numCell(p.features.maxOrganizations),
  },
  {
    label: 'Members / org',
    getValue: (p) => numCell(p.features.maxMembersPerOrg),
  },
  {
    label: 'Projects / org',
    getValue: (p) => numCell(p.features.maxProjectsPerOrg),
  },
  {
    label: 'Storage',
    getValue: (p) => (
      <span className="text-sm font-medium">
        {p.features.storageGb >= 1000
          ? `${p.features.storageGb / 1000} TB`
          : `${p.features.storageGb} GB`}
      </span>
    ),
  },
  {
    label: 'Approval flows',
    getValue: (p) => boolCell(p.features.hasApprovalFlows),
  },
  {
    label: 'Custom branding',
    getValue: (p) => boolCell(p.features.canCustomBrand),
  },
]

const PlansGrid = () => {
  const { data, isLoading } = apiRequest.billing.plans.fetchAll.useQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const billing = data as BillingResponse | undefined
  const plans = billing?.plans ?? []
  const currentPlanId = billing?.subscription?.plan.id ?? null

  return (
    <div className="flex-1 px-6 md:px-10 py-8 space-y-8">
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.id === currentPlanId}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-16">
          No plans configured yet.
        </p>
      )}

      {plans.length > 1 && (
        <>
          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">Feature Comparison</p>

            <div className="rounded-xl border border-hairline overflow-hidden">
              <div className="flex items-center bg-surface-soft px-4 py-3 border-b border-hairline">
                <span className="text-xs font-medium text-muted-foreground w-40 shrink-0">
                  Feature
                </span>
                {plans.map((plan) => (
                  <span
                    key={plan.id}
                    className={`flex-1 text-center text-xs font-medium ${
                      plan.id === currentPlanId
                        ? 'text-lava'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {plan.name}
                  </span>
                ))}
              </div>

              {featureRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center px-4 py-3 border-b border-hairline last:border-b-0 hover:bg-surface-soft/60 transition-colors"
                >
                  <span className="text-sm text-muted-foreground w-40 shrink-0">
                    {row.label}
                  </span>
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex-1 text-center">
                      {row.getValue(plan)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PlansGrid
