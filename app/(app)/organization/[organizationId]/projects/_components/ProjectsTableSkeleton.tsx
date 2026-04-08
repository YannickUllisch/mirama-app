// app/(app)/organization/[organizationId]/projects/_components/ProjectsTableSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const ProjectsTableSkeleton = () => (
  <div className="space-y-4">
    {/* Toolbar */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-64 rounded-md" />
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>

    {/* Table header */}
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-4 bg-muted/40 px-4 py-3 border-b border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 flex-1" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0"
        >
          {Array.from({ length: 8 }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
)

export default ProjectsTableSkeleton
