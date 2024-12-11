'use client'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
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
    <DataTable
      tableIdentifier="archivedTable"
      toolbarOptions={{
        showFilterOption: true,
        filterOptionType: 'PROJECT',
      }}
      footerOptions={{ showPagination: true }}
      expandedContent
      columns={ArchiveColumns({ mutate: updateProjects, session: session })}
      data={projects ?? []}
      dataLoading={projectsLoading}
    />
  )
}

export default ArchivePage
