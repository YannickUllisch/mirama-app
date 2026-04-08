// app/(app)/organization/[organizationId]/projects/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Folders } from 'lucide-react'
import { Suspense } from 'react'
import ProjectsTable from './_components/ProjectsTable'
import ProjectsTableSkeleton from './_components/ProjectsTableSkeleton'

const ProjectsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Your Projects"
        description="Manage your projects"
        icon={Folders}
      />
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsTable />
      </Suspense>
    </div>
  )
}

export default ProjectsPage
