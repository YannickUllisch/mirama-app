'use client'

import apiRequest from '@hooks'
import { Loader2 } from 'lucide-react'
import PlanCard from '../../_components/PlanCard'

const PlansGrid = () => {
  const { data: plans, isLoading } =
    apiRequest.billing.plans.fetchAll.useQuery()
  const { data: tenant } = apiRequest.tenant.fetch.useQuery()

  const currentPlanId = tenant?.subscription.plan.id ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex-1 px-6 md:px-10 py-8">
      {plans && plans.length > 0 ? (
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
    </div>
  )
}

export default PlansGrid
