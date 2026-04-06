// app/(app)/tenant/[tenantId]/billing/_components/UsageSectionSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const UsageSectionSkeleton = () => (
  <div className="rounded-xl border border-border p-5 space-y-5">
    <Skeleton className="h-4 w-28" />
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    ))}
  </div>
)

export default UsageSectionSkeleton
