'use client'
import { Button } from '@src/components/ui/button'
import { Folder, Plus } from 'lucide-react'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { ProjectUser, Project, User } from '@prisma/client'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { TableCell, TableFooter, TableRow } from '@src/components/ui/table'
import AddProjectDialog from '@src/components/Dialogs/AddProjectDialog'
import { useSession } from 'next-auth/react'
import { ProjectColumns } from './columns'
import { projectIncludeConfig } from './shared'

const ClientProjectsPage = () => {
  // Session
  const { data: session } = useSession({ required: true })

  // Fetching Data
  const {
    data: projects,
    mutate: updateProjects,
    isLoading: projectsLoading,
  } = useSWR<
    (Project & {
      users: ProjectUser[]
    })[]
  >(
    `/api/db/project?archived=false&include=${encodeURIComponent(
      JSON.stringify(projectIncludeConfig),
    )}`,
  )

  const { data: users, isLoading: usersLoading } = useSWR<User[]>(
    '/api/db/team/member',
  )

  const LeftToolbar = () => {
    return (
      <AddProjectDialog
        key={'Project Dialog'}
        mutate={updateProjects}
        button={
          <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Plus width={15} className="ml-2" />
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              New Project
            </Button>
          </div>
        }
      />
    )
  }

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
      })}
      data={projects ?? []}
      dataLoading={projectsLoading || usersLoading}
      toolbarOptions={{
        showViewOptionsicon: true,
        showFilterOption: true,
        filterOptionType: 'PROJECT',
        addToolbarleft: isTeamAdminOrOwner(session) && <LeftToolbar />,
        refresh: { mutate: updateProjects },
      }}
      footerOptions={{
        addFooterRow: <FooterRow />,
        showPagination: true,
      }}
    />
  )
}

export default ClientProjectsPage
