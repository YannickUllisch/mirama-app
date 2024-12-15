import { tableProjectsInclude } from '@/app/app/shared'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
import { TableCell, TableFooter, TableRow } from '@src/components/ui/table'
import type { Session } from 'next-auth'
import React, { useEffect, type FC } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { ProjectColumns } from './columns'

interface Props {
  users: User[]
  session: Session | null
}
const TableTab: FC<Props> = ({ users, session }) => {
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
    url: '/api/db/project',
    archived: false,
    include: tableProjectsInclude,
  })

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
    <div className="h-[2000px]">
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

export default TableTab
