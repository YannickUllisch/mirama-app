// app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSectionSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const SubscriptionSectionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
)

export default SubscriptionSectionSkeleton
