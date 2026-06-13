// app/(app)/tenant/[tenantId]/billing/_components/UsageSectionSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const UsageSectionSkeleton = () => (
  <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
    <div className="px-6 py-4 bg-surface-dark flex items-center gap-2">
      <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
      <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
    </div>
    <div className="p-6 space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`usage-skel-${i}`} className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3.5 w-14" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
)

export default UsageSectionSkeleton
