import type {
  Member,
  Milestone,
  Project,
  ProjectMember,
  Tag,
  Task,
} from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'

export const ProjectMapper = {
  mapDefaultToApi: (
    input: Project & {
      milestones: Milestone[]
      tags: Tag[]
      tasks: Task[]
      members: (ProjectMember & { member: Member })[]
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
      members: input.members.map((m) => ({
        ...m.member,
        id: m.memberId,
        organizationRole: m.member.role,
        isManager: m.isManager,
      })),
      tasks: input.tasks.map((t) => ({ ...t })),
    }
  },
}
