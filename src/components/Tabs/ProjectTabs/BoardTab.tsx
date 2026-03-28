'use client'

import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { ProjectResponse } from '@server/modules/project/features/response'
import type { TaskResponse } from '@server/modules/task/features/response'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'

const BoardTab = ({
  project,
  tasks,
  users,
}: {
  project: ProjectResponse | null
  tasks: TaskResponse[]
  users: MemberResponse[]
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
