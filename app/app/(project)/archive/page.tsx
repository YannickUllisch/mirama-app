'use client'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
import { Archive } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'
import { ArchiveColumns } from './columns'

const ArchivePage = () => {
  const { data: session } = useSession()
  const {
    data: projects,
    mutate: updateProjects,
    isLoading: projectsLoading,
  } = useSWR<
    (Project & {
      users: (ProjectUser & { user: User })[]
    })[]
  >('/api/db/project?archived=true')

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-5">
        <Archive width={20} />
        <span style={{ fontSize: 20 }}>Archive</span>
      </div>
      <DataTable
        tableIdentifier="archivedTable"
        toolbarOptions={{
          showViewOptionsicon: true,
          showFilterOption: true,
          filterOptionType: 'PROJECT',
        }}
        footerOptions={{ showPagination: true }}
        expandedContent
        columns={ArchiveColumns({ mutate: updateProjects, session: session })}
        data={projects ?? []}
        dataLoading={projectsLoading}
      />
    </>
  )
}

export default ArchivePage
