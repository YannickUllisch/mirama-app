'use client'

import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Folders, Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import { usePmHeader } from '../_components/PmHeaderContext'
import PmHeaderCrumb from '../_components/PmHeaderCrumb'
import ProjectsContent from './_components/ProjectsContent'
import ProjectsTableSkeleton from './_components/ProjectsTableSkeleton'

const ProjectsPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>()

  usePmHeader(
    <div className="flex w-full items-center justify-between">
      <PmHeaderCrumb label="Projects" />
      <Button asChild variant="tertiary" size="sm">
        <Link href={`/organization/${organizationId}/projects/create`}>
          <Plus className="size-3.5" />
          New project
        </Link>
      </Button>
    </div>,
  )

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
