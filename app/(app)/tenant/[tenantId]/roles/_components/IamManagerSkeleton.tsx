// app/(app)/tenant/[tenantId]/roles/components/IamManagerSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const IamManagerSkeleton = () => (
  <div className="space-y-5">
    {/* Tabs skeleton */}
    <div className="flex gap-1 h-9">
      <Skeleton className="h-8 w-24 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
      <Skeleton className="h-8 w-32 rounded-md" />
    </div>

    {/* Search bar + button */}
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-8 w-24" />
    </div>

    {/* Section header */}
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-72" />
      </div>
    </div>

    {/* Role cards */}
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 flex items-center gap-4"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>

    {/* Divider */}
    <div className="border-t border-black/10 dark:border-white/10" />

    {/* Section header 2 */}
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-xl" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-64" />
      </div>
    </div>

    {/* Role cards 2 */}
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 flex items-center gap-4"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  </div>
)

export default IamManagerSkeleton
