// app/(app)/tenant/[tenantId]/billing/plans/_components/PlansGridSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const STRIPE_COLORS = [
  'bg-signature-coral/20',
  'bg-signature-mustard/20',
  'bg-signature-mint/20',
  'bg-signature-forest/20',
]

const PlansGridSkeleton = () => (
  <div className="flex-1 px-4 py-5 space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`plan-skel-${i}`}
          className="rounded-xl border border-border overflow-hidden"
        >
          <div className={`h-1 w-full ${STRIPE_COLORS[i]}`} />
          <div className="p-5 space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-7 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={`feat-skel-${j}`} className="h-3.5 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>

    <Skeleton className="h-px w-full" />

    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-border bg-muted/40">
          <Skeleton className="h-3.5 w-20 mr-auto" />
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={`hdr-skel-${j}`} className="h-3.5 w-16 ml-8" />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`row-skel-${i}`}
            className="flex items-center px-4 py-3 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-3.5 w-28 mr-auto" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={`cell-skel-${j}`} className="h-3.5 w-16 ml-8" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default PlansGridSkeleton
