import type {
  Member,
  Milestone,
  PriorityType,
  Project,
  ProjectMember,
  StatusType,
  Tag,
  Task,
} from '@/prisma/generated/client'

export type ProjectResponse = {
  id: string
  name: string
  description: string | null
  startDate: Date
  endDate: Date
  priority: PriorityType
  status: StatusType
  archived: boolean
  budget: number
  milestones: { id: string; date: Date; title: string; colors: string }[]
  tags: { id: string; title: string }[]
  members: {
    id: string
    name: string
    email: string
    isInherited: boolean
    iamRoleId: string
  }[]
  tasks: {
    id: string
    title: string
    type: string
    assignedToId: string | null
    dueDate: Date
    startDate: Date
    description: string | null
    priority: string
    status: string
    parentId: string | null
  }[]
}

type ProjectWithRelations = Project & {
  milestones: Milestone[]
  tags: Tag[]
  tasks: Task[]
  members: (ProjectMember & { member: Member })[]
}

export const toProjectResponse = (
  input: ProjectWithRelations,
): ProjectResponse => ({
  id: input.id,
  name: input.name,
  description: input.description,
  startDate: input.startDate,
  endDate: input.endDate,
  priority: input.priority,
  status: input.status,
  archived: input.archived,
  budget: input.budget,
  milestones: input.milestones.map((m) => ({
    id: m.id,
    date: m.date,
    title: m.title,
    colors: m.colors,
  })),
  tags: input.tags.map((t) => ({ id: t.id, title: t.title })),
  members: input.members.map((m) => ({
    id: m.memberId,
    name: m.member.name,
    email: m.member.email,
    isInherited: m.isInherited,
    iamRoleId: m.member.iamRoleId,
  })),
  tasks: input.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    assignedToId: t.assignedToId,
    dueDate: t.dueDate,
    startDate: t.startDate,
    description: t.description,
    priority: t.priority,
    status: t.status,
    parentId: t.parentId,
  })),
})
