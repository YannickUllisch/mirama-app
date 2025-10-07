import type {
  Milestone,
  Project,
  ProjectUser,
  Tag,
  Task,
  User,
} from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'

const mapDefaultToApi = (
  input: Project & {
    milestones: Milestone[]
    tags: Tag[]
    tasks: Task[]
    users: (ProjectUser & { user: User })[]
  },
): ProjectResponseInput => {
  return {
    archived: input.archived,
    budget: input.budget,
    description: input.description,
    endDate: input.endDate,
    id: input.id,
    name: input.name,
    priority: input.priority,
    startDate: input.startDate,
    status: input.status,
    milestones: input.milestones.map((m) => ({ ...m })),
    tags: input.tags.map((t) => ({ title: t.title, id: t.id })),
    users: input.users.map((u) => ({
      ...u.user,
      id: u.user.id,
      isManager: u.isManager,
    })),
    tasks: input.tasks.map((t) => ({ ...t })),
  }
}

export const ProjectMapper = {
  mapDefaultToApi,
}
