'use client'
import type { UserResponseType } from '@server/domain/memberSchema'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { TaskResponseType } from '@server/domain/taskSchema'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'

const BoardTab = ({
  project,
  tasks,
  users,
}: {
  project: ProjectResponseInput | null
  tasks: TaskResponseType[]
  users: UserResponseType[]
}) => {
  return (
    <KanbanBoard
      tasks={tasks ?? []}
      projectId={project?.id ?? ''}
      users={users}
    />
  )
}
export default BoardTab
