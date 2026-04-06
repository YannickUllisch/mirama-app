// app/(app)/tenant/[tenantId]/billing/plans/_components/PlansGridSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const PlansGridSkeleton = () => (
  <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-5 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-8 w-24" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-3.5 w-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}
    </div>

    <Skeleton className="h-px w-full" />

    <div className="space-y-3">
      <Skeleton className="h-5 w-48" />
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center px-4 py-3 border-b border-border last:border-b-0"
          >
            <Skeleton className="h-3.5 w-32 mr-auto" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-3.5 w-16 ml-8" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default PlansGridSkeleton
