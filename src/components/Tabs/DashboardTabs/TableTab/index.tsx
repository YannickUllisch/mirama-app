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
  onRouteChange: () => void
  session: Session | null
}
const TableTab: FC<Props> = ({ users, session, onRouteChange }) => {
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
    <DataTable
      tableIdentifier="projectPageTable"
      columns={ProjectColumns({
        mutate: updateProjects,
        session: session,
        users: users ?? [],
        onRouteChange: onRouteChange,
      })}
      data={projects ?? []}
      dataLoading={projectsLoading}
      toolbarOptions={{
        showViewOptionsicon: true,
        showFilterOption: true,
        filterOptionType: 'PROJECT',
        refresh: { mutate: updateProjects },
      }}
      footerOptions={{
        addFooterRow: <FooterRow />,
        showPagination: true,
      }}
    />
  )
}

export default TableTab
