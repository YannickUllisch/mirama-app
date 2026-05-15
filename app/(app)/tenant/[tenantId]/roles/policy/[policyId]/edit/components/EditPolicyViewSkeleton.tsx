// app/(app)/tenant/[tenantId]/roles/policy/[policyId]/edit/components/EditPolicyViewSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const EditPolicyViewSkeleton = () => (
  <div className="flex flex-col">
    {/* PageHeader */}
    <div className="border-b border-border/50 px-6 h-16 flex items-center gap-3">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-48" />
    </div>

    <div className="space-y-4 px-4 pt-5 pb-6">
      {/* Policy Details card */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="h-12 bg-signature-coral/20 px-6 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-80" />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Permissions card */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="h-12 bg-signature-forest/20 px-6 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`perm-skel-${i}`}
              className="px-4 py-3 flex items-center gap-2.5"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default EditPolicyViewSkeleton
