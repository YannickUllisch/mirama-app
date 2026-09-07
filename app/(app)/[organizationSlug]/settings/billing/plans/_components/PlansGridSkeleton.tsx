import { Skeleton } from '@ui/skeleton'

const PlansGridSkeleton = () => (
  <div className="flex-1 px-6 md:px-10 py-8 space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => {
        const isFeatured = i === 0
        return (
          <div
            key={`plan-skel-${i}`}
            className={`rounded-xl overflow-hidden ${isFeatured ? 'bg-surface-dark' : 'border border-hairline bg-surface-soft'}`}
          >
            <div
              className={`h-1 w-full ${isFeatured ? 'bg-lava' : 'bg-surface-medium'}`}
            />
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                {isFeatured ? (
                  <>
                    <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-40 rounded bg-white/10 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </>
                )}
              </div>
              {isFeatured ? (
                <div className="h-7 w-24 rounded bg-white/10 animate-pulse" />
              ) : (
                <Skeleton className="h-7 w-24" />
              )}
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, j) =>
                  isFeatured ? (
                    <div
                      key={`feat-skel-${j}`}
                      className="h-3.5 w-full rounded bg-white/10 animate-pulse"
                    />
                  ) : (
                    <Skeleton key={`feat-skel-${j}`} className="h-3.5 w-full" />
                  ),
                )}
              </div>
              {isFeatured ? (
                <div className="h-8 w-full rounded-lg bg-white/10 animate-pulse" />
              ) : (
                <Skeleton className="h-8 w-full rounded-lg" />
              )}
            </div>
          </div>
        )
      })}
    </div>

    <Skeleton className="h-px w-full" />

    <div className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <div className="rounded-xl border border-hairline overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-hairline bg-surface-soft">
          <Skeleton className="h-3.5 w-20 mr-auto" />
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={`hdr-skel-${j}`} className="h-3.5 w-16 ml-8" />
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`row-skel-${i}`}
            className="flex items-center px-4 py-3 border-b border-hairline last:border-b-0"
          >
            <Skeleton className="h-3.5 w-28 mr-auto" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={`cell-skel-${j}`} className="h-3.5 w-16 ml-8" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default PlansGridSkeleton
