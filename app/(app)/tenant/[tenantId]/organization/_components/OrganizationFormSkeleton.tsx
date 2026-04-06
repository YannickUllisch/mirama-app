// app/(app)/tenant/[tenantId]/organization/_components/OrganizationFormSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const OrganizationFormSkeleton = () => (
  <div className="flex flex-col min-h-0">
    <Skeleton className="h-5 w-40 ml-2 mt-2" />

    <div className="px-6 md:px-10 py-6 space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  </div>
)

export default OrganizationFormSkeleton
