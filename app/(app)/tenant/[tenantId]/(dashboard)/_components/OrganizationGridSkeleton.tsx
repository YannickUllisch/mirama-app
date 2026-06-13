// app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationGridSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const OrganizationGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={`org-skel-${i}`}
        className="rounded-xl bg-surface-dark/10 p-5 space-y-5"
      >
        <div className="flex items-start justify-between">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-4 pt-4 border-t border-border">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
)

export default OrganizationGridSkeleton
