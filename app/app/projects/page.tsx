'use client'
import type { Project, ProjectUser, User } from '@prisma/client'
import { DataTable } from '@src/components/Tables/DataTable'
import { TableCell, TableFooter, TableRow } from '@src/components/ui/table'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { ProjectColumns } from './columns'
import useSocketStore from '@store/socket'

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

  const { socket, connect, emit } = useSocketStore() // deconstructing socket and its method from socket store
  const { data: session } = useSession({ required: true })

  useEffect(() => {
    connect()
  }, [connect])

  // Effect for listening to team status updates
  useEffect(() => {
    if (!session?.user.id || !socket) return
    // Only listen to the `team_status` event once per socket connection
    const onTeamStatusUpdate = (data: any) => {
      console.log('Updated team status:', data)
    }

    // Emit the join_team event after the connection is established
    emit('join_team', {
      userId: session?.user.id,
      teamId: session?.user.teamId,
    })

    socket.on('team_status', onTeamStatusUpdate)

    // Clean up the listener when the component is unmounted or socket changes
    return () => {
      socket.off('team_status', onTeamStatusUpdate)
    }
  }, [socket, session, socket, emit]) // This effect runs when the socket is available

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
