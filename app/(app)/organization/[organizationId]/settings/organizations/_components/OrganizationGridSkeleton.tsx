// app/(app)/organization/[organizationId]/settings/organizations/_components/OrganizationGridSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const OrganizationGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={`org-skel-${i}`}
        className="rounded-xl border border-hairline overflow-hidden"
      >
        <div className="bg-surface-soft border-b border-hairline px-6 py-8 flex items-center justify-center">
          <Skeleton className="h-14 w-14 rounded-xl" />
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="pt-3 border-t border-hairline flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

export default OrganizationGridSkeleton
