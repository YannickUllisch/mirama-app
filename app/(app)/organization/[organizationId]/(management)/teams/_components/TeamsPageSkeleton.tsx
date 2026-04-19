// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamsPageSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const TeamsPageSkeleton = () => (
  <div className="space-y-5">
    {/* Action bar */}
    <div className="flex justify-end">
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>

    {/* Team section cards */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
          <Skeleton className="h-4 w-4 rounded shrink-0" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>

        {/* Member rows */}
        {Array.from({ length: i + 2 }).map((_, j) => (
          <div
            key={j}
            className="flex items-center justify-between px-4 py-3 border-b border-border/60 last:border-b-0"
          >
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        ))}
      </div>
    ))}
  </div>
)

export default TeamsPageSkeleton
