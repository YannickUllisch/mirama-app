// app/(app)/tenant/[tenantId]/billing/_components/SubscriptionSectionSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const HEADER_COLORS = [
  'bg-signature-coral/20',
  'bg-signature-mustard/20',
  'bg-signature-mint/20',
  'bg-signature-forest/20',
]

const SubscriptionSectionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={`sub-skel-${i}`}
        className="rounded-xl border border-border overflow-hidden"
      >
        <div className={`px-4 py-2.5 ${HEADER_COLORS[i]}`}>
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="px-4 py-3 space-y-1.5">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
)

export default SubscriptionSectionSkeleton
