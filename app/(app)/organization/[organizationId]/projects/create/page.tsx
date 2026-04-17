// app/(app)/organization/[organizationId]/projects/create/page.tsx
import { Skeleton } from '@src/components/ui/skeleton'
import { Suspense } from 'react'
import CreateProjectForm from './_components/CreateProjectForm'

const CreateProjectFormSkeleton = () => (
  <div className="space-y-6 pb-12.5">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
    <Skeleton className="h-16 w-full rounded-lg" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  </div>
)

const CreateProjectPage = () => {
  return (
    <Suspense fallback={<CreateProjectFormSkeleton />}>
      <CreateProjectForm />
    </Suspense>
  )
}

export default CreateProjectPage
