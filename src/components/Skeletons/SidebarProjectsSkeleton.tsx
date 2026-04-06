// src/components/Skeletons/SidebarProjectsSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const SidebarProjectsSkeleton = () => (
  <div className="flex flex-col gap-1 px-2 py-2">
    <Skeleton className="h-4 w-16 rounded-md mb-1" />
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={`proj-skel-${i}`} className="h-7 w-full rounded-md" />
    ))}
  </div>
)

export default SidebarProjectsSkeleton
