// app/(app)/tenant/[tenantId]/(dashboard)/OrganizationGridSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const OrganizationGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={`org-skel-${i}`} className="h-36 rounded-xl" />
    ))}
  </div>
)

export default OrganizationGridSkeleton
