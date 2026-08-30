// app/(app)/organization/[organizationId]/settings/billing/_components/SubscriptionSectionSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const SubscriptionSectionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={`sub-skel-${i}`}
        className="rounded-lg border border-border/50 overflow-hidden shadow-sm"
      >
        <div className="px-4 py-2.5 bg-surface-dark">
          <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="px-4 py-3.5 space-y-1.5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
)

export default SubscriptionSectionSkeleton
