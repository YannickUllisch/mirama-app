// app/(app)/organization/[organizationId]/(management)/members/_components/MembersPageSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const MembersPageSkeleton = () => (
  <div className="space-y-5">
    {/* Hierarchy legend */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-3" />
      <Skeleton className="h-3.5 w-40" />
    </div>

    {/* Organization members section */}
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-6 ml-auto" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 border-b border-border/60 last:border-b-0"
        >
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-7 w-40 rounded-md" />
          </div>
        </div>
      ))}
    </div>

    {/* Project members section */}
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-36" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 border-b border-border/60 last:border-b-0"
        >
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-7 w-40 rounded-md" />
        </div>
      ))}
    </div>

    {/* Available roles */}
    <div className="space-y-2">
      <Skeleton className="h-3 w-28" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-32 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
)

export default MembersPageSkeleton
