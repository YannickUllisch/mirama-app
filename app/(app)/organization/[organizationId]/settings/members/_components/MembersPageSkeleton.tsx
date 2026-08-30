import { Skeleton } from '@ui/skeleton'

const MembersPageSkeleton = () => (
  <div className="px-6 md:px-10 py-10">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8 items-start">
      <div className="space-y-5">
        <div className="flex gap-1">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <div className="flex h-0.5 w-full">
            <div className="flex-1 bg-signature-coral/40" />
            <div className="flex-1 bg-signature-forest/40" />
            <div className="flex-1 bg-signature-mint/40" />
            <div className="flex-1 bg-signature-mustard/40" />
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <Skeleton className="h-8 w-56 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border/60 bg-muted/40">
            <Skeleton className="h-3 w-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32 ml-8" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>

          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 border-b border-border/60 last:border-b-0"
            >
              <Skeleton
                className={`w-1.5 h-7 rounded-full ${
                  [
                    'bg-signature-coral/50',
                    'bg-signature-forest/50',
                    'bg-signature-peach/50',
                    'bg-signature-mint/50',
                    'bg-signature-yellow/50',
                    'bg-signature-mustard/50',
                  ][i % 6]
                }`}
              />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-7 w-40 rounded-md" />
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border">
        <div className="h-12 bg-surface-dark/20" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-5 py-3 border-b border-border/60 last:border-b-0"
          >
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default MembersPageSkeleton
