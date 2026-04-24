// app/(app)/tenant/[tenantId]/roles/policy/[policyId]/edit/components/EditPolicyViewSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const EditPolicyViewSkeleton = () => (
  <div className="flex flex-col min-h-screen">
    {/* Back button */}
    <Skeleton className="h-5 w-44 ml-2 mt-2" />

    {/* PageHeader area */}
    <div className="px-6 md:px-10 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Scope selector */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-80" />
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      {/* Name field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Permissions accordion */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden divide-y divide-black/10 dark:divide-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-3 py-2.5 flex items-center gap-2.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default EditPolicyViewSkeleton
