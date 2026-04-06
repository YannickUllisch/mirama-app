// app/(app)/tenant/[tenantId]/billing/_components/PlanCard.tsx
import type {
  PlanFeatures,
  PlanResponse,
} from '@server/modules/account/tenant/billing/features/response'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { fmtPrice, isUnlimited } from './billing-helpers'

const FeatureLine = ({
  text,
  included,
}: {
  text: string
  included: boolean
}) => (
  <li className="flex items-center gap-2 text-[13px]">
    {included ? (
      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
    ) : (
      <X className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0" />
    )}
    <span
      className={
        included ? 'text-foreground' : 'text-muted-foreground/50 line-through'
      }
    >
      {text}
    </span>
  </li>
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
      className={`relative flex flex-col rounded-xl border p-5 transition-colors ${
        isCurrent
          ? 'border-primary ring-1 ring-primary/20'
          : 'border-border hover:border-foreground/15'
      }`}
    >
      {isCurrent && (
        <Badge className="absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 gap-1 bg-primary text-primary-foreground">
          Current
        </Badge>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold">{plan.name}</h3>
        {plan.description && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {plan.description}
          </p>
        )}
      </div>

      <p className="text-2xl font-bold tracking-tight mb-1">
        {fmtPrice(plan.price)}
        {plan.price > 0 && (
          <span className="text-xs font-normal text-muted-foreground ml-1">
            /{plan.interval === 'year' ? 'yr' : 'mo'}
          </span>
        )}
      </p>

      <ul className="mt-4 space-y-2 flex-1">
        <FeatureLine
          text={`${isUnlimited(f.maxOrganizations) ? 'Unlimited' : f.maxOrganizations} organization${f.maxOrganizations !== 1 ? 's' : ''}`}
          included
        />
        <FeatureLine
          text={`${isUnlimited(f.maxMembersPerOrg) ? 'Unlimited' : f.maxMembersPerOrg} members / org`}
          included
        />
        <FeatureLine
          text={`${isUnlimited(f.maxProjectsPerOrg) ? 'Unlimited' : f.maxProjectsPerOrg} projects / org`}
          included
        />
        <FeatureLine
          text={`${f.storageGb >= 1000 ? `${f.storageGb / 1000} TB` : `${f.storageGb} GB`} storage`}
          included={f.storageGb > 0}
        />
        <FeatureLine text="Approval flows" included={f.hasApprovalFlows} />
        <FeatureLine text="Custom branding" included={f.canCustomBrand} />
      </ul>

      {!isCurrent && (
        <Button
          variant={plan.price === 0 ? 'outline' : 'default'}
          size="sm"
          className="w-full mt-5"
          disabled
        >
          {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      )}
    </div>
  )
}

export default PlanCard
