'use client'
import type {} from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { TaskResponseType } from '@server/domain/taskSchema'
import type { UserResponseType } from '@server/domain/userSchema'
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
      projectName={project?.name ?? ''}
      tasks={tasks ?? []}
      projectId={project?.id ?? ''}
      users={users}
    />
  )
}
export default BoardTab
