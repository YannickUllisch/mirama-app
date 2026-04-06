// src/components/Skeletons/SidebarNavSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const SidebarNavSkeleton = () => (
  <div className="flex flex-col gap-1 px-2 py-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={`nav-skel-${i}`} className="h-8 w-full rounded-md" />
    ))}
  </div>
)

export default SidebarNavSkeleton
