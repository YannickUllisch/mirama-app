import type { PlanResponse } from '@src/modules/tenant/tenant/tenant.types'
import { Button } from '@ui/button'
import { ArrowUpRight, Check } from 'lucide-react'
import { fmtPrice } from './billing-helpers'

const PlanCard = ({
  plan,
  isCurrent,
}: {
  plan: PlanResponse
  isCurrent: boolean
}) => {
  if (isCurrent) {
    return (
      <div className="relative flex flex-col rounded-xl overflow-hidden bg-surface-dark">
        <div className="h-1 w-full bg-lava" />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-white">{plan.name}</h3>
              {plan.description && (
                <p className="text-xs text-white/50 mt-0.5">
                  {plan.description}
                </p>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-lava px-2 py-0.5 text-[10px] font-medium text-white">
              Current
            </span>
          </div>

          <p className="text-2xl font-medium text-white mb-1">
            {fmtPrice(plan.price)}
            {plan.price > 0 && (
              <span className="text-xs font-normal text-white/50 ml-1">
                /{plan.interval === 'year' ? 'yr' : 'mo'}
              </span>
            )}
          </p>

          <ul className="mt-4 space-y-2.5 flex-1">
            {plan.features.map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-[13px]">
                <Check className="w-3.5 h-3.5 shrink-0 text-success-border" />
                <span className="text-white/80">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col rounded-xl border border-hairline bg-surface-soft overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-1 w-full bg-surface-medium" />
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-ink">{plan.name}</h3>
          {plan.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {plan.description}
            </p>
          )}
        </div>

        <p className="text-2xl font-medium text-ink mb-1">
          {fmtPrice(plan.price)}
          {plan.price > 0 && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              /{plan.interval === 'year' ? 'yr' : 'mo'}
            </span>
          )}
        </p>

        <ul className="mt-4 space-y-2.5 flex-1">
          {plan.features.map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-[13px]">
              <Check className="w-3.5 h-3.5 shrink-0 text-success" />
              <span className="text-ink">{feat}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.price === 0 ? 'outline' : 'mirama'}
          size="sm"
          className="w-full mt-5"
          disabled
        >
          {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default PlanCard
