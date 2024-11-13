'use client'
import type { FC } from 'react'
import type { Project, ProjectUser, Task, User } from '@prisma/client'
import useSWR from 'swr'
import KanbanBoard from '../Kanban/KanbanBoard'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface TabProps {
  session: Session | null
  project: Project & {
    users: (ProjectUser & { user: User })[]
    tasks: (Task & { assignedTo: User | null })[]
  }
}

const BoardTab: FC<TabProps> = ({ project, session }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?id=${project?.id}`)

  return (
    <KanbanBoard
      tasks={tasks ?? []}
      projectId={project?.id}
      session={session}
    />
  )
}
export default BoardTab
