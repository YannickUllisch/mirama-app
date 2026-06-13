// app/(app)/tenant/[tenantId]/roles/components/IamManagerSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const IamManagerSkeleton = () => (
  <div className="space-y-5">
    {/* Top-level tabs: Roles / Policies */}
    <div className="flex gap-1 h-9">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>

    {/* Scope sub-tabs: Organization / Project / Client */}
    <div className="flex gap-1 h-9">
      <Skeleton className="h-8 w-28 rounded-md" />
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>

    {/* Toolbar: filter + action button */}
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-8 w-24" />
    </div>

    {/* Table */}
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-hairline bg-surface-soft">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-40 ml-auto" />
      </div>
      {/* Data rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-48" />
          <div className="flex gap-1 ml-auto">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
      ))}
    </div>
  </div>
)

export default IamManagerSkeleton
