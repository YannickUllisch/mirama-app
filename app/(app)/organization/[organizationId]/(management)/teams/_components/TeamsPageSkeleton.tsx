import { Skeleton } from '@ui/skeleton'

const HEADER_COLORS = [
  'bg-signature-coral/30',
  'bg-signature-forest/30',
  'bg-signature-cream/40',
]

const TeamsPageSkeleton = () => (
  <div className="px-6 md:px-10 py-10 space-y-5">
    <div className="flex justify-end">
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>

    {/* Team cards */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-lg overflow-hidden border border-border">
        <div
          className={`flex items-center gap-3 px-6 py-4 ${HEADER_COLORS[i % HEADER_COLORS.length]}`}
        >
          <Skeleton className="h-4 w-4 rounded shrink-0" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-16" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
          </div>

          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border/60 bg-muted/40">
            <Skeleton className="h-3 w-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32 ml-8" />
          </div>

          {Array.from({ length: i + 2 }).map((_, j) => (
            <div
              key={j}
              className="flex items-center gap-4 px-4 py-3 border-b border-border/60 last:border-b-0"
            >
              <Skeleton
                className={`w-1.5 h-7 rounded-full ${
                  [
                    'bg-signature-coral/50',
                    'bg-signature-forest/50',
                    'bg-signature-peach/50',
                  ][j % 3]
                }`}
              />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default TeamsPageSkeleton
