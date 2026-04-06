// app/(app)/tenant/[tenantId]/settings/SettingsFormSkeleton.tsx
import { Skeleton } from '@ui/skeleton'

const SettingsFormSkeleton = () => (
  <div className="px-6 md:px-10 py-6 space-y-6">
    <Skeleton className="h-48 rounded-xl" />
    <Skeleton className="h-36 rounded-xl" />
    <Skeleton className="h-36 rounded-xl" />
  </div>
)

export default SettingsFormSkeleton
