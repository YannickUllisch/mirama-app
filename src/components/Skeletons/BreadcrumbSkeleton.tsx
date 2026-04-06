// src/components/Skeletons/BreadcrumbSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const BreadcrumbSkeleton = () => (
  <div className="hidden md:flex items-center gap-1.5">
    <Skeleton className="h-3 w-16 rounded" />
    <Skeleton className="h-3 w-2 rounded" />
    <Skeleton className="h-3 w-20 rounded" />
  </div>
)

export default BreadcrumbSkeleton
