'use client'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
import { useSession } from 'next-auth/react'
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
      users: ProjectUser[]
    })[]
  >({
    url: 'project',
    archived: true,
    select: {
      name: true,
      users: true,
      startDate: true,
      endDate: true,
      priority: true,
      status: true,
      budget: true,
    },
  })

  const { data: users } = useSWR<User[]>('team/member')

  return (
    <DataTable
      tableIdentifier="archivedTable"
      toolbarOptions={{
        showFilterOption: true,
        filterOptionType: 'PROJECT',
      }}
      footerOptions={{ showPagination: true }}
      expandedContent
      columns={ArchiveColumns({
        mutate: updateProjects,
        session: session,
        users: users ?? [],
      })}
      data={projects ?? []}
      dataLoading={projectsLoading}
    />
  )
}

export default ArchivePage
