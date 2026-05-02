// app/(app)/organization/[organizationId]/projects/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Folders } from 'lucide-react'
import { Suspense } from 'react'
import ProjectsContent from './_components/ProjectsContent'
import ProjectsTableSkeleton from './_components/ProjectsTableSkeleton'

const ProjectsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Projects"
        description="Creative project portfolio"
        icon={Folders}
      />
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </div>
  )
}

export default ProjectsPage
