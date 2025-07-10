'use client'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
import { TableCell, TableFooter, TableRow } from '@src/components/ui/table'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { ProjectColumns } from './columns'

const ProjectsPage = () => {
  // Fetching Project Data
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
    archived: false,
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
  const { data: session } = useSession({ required: true })

  const { data: users } = useSWR<User[]>('team/member')

  const FooterRow = () => {
    return (
      <TableFooter>
        <TableRow className="dark:bg-neutral-900 bg-neutral-50">
          <TableCell className="dark:text-white cursor-default" colSpan={8}>
            Total
          </TableCell>
          <TableCell className="dark:text-white cursor-default" colSpan={2}>
            Total:{' '}
            {projects?.reduce((acc, curr) => acc + (curr.budget || 0), 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    )
  }

  return (
    <div>
      <DataTable
        tableIdentifier="projectPageTable"
        columns={ProjectColumns({
          mutate: updateProjects,
          session: session,
          users: users ?? [],
        })}
        data={projects ?? []}
        dataLoading={projectsLoading}
        toolbarOptions={{
          showFilterOption: true,
          filterOptionType: 'PROJECT',
          refresh: { mutate: updateProjects },
        }}
        footerOptions={{
          addFooterRow: <FooterRow />,
          showPagination: true,
        }}
      />
    </div>
  )
}

export default ProjectsPage
