import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'
import type { PriorityType, StatusType } from '@prisma/client'

const PROJECT_INCLUDE = {
  milestones: true,
  tags: true,
  tasks: true,
  members: { include: { member: true } },
} as const

export const ProjectRepository = (db: ScopedDb) => ({
  async findAll(opts: {
    sessionUserId: string
    archived: boolean
    isAdminOrOwner: boolean
  }) {
    return await db.project.findMany({
      where: {
        archived: opts.archived,
        ...(opts.isAdminOrOwner
          ? {}
          : { members: { some: { memberId: opts.sessionUserId } } }),
      },
      include: PROJECT_INCLUDE,
      orderBy: { name: 'asc' },
    })
  },

  async findById(id: string) {
    return await db.project.findFirst({
      where: { id },
      include: PROJECT_INCLUDE,
    })
  },

  async findByName(name: string) {
    return await db.project.findFirst({
      where: { name },
      select: { id: true },
    })
  },

  async findProjectMembers(projectId: string) {
    return await db.project.findFirst({
      where: { id: projectId },
      select: { members: { select: { memberId: true } } },
    })
  },

  async getAssignees(projectId: string) {
    return await db.member.findMany({
      where: { projectLinks: { some: { projectId } } },
    })
  },

  // organizationId auto-injected by ScopedDb
  async create(data: {
    name: string
    description: string | null
    startDate: Date
    endDate: Date
    priority: PriorityType
    status: StatusType
    archived: boolean
    budget: number
    tags: { connect: { id: string }[]; create: { title: string }[] }
    members: {
      createMany: { data: { memberId: string; isManager: boolean }[] }
    }
    milestones: {
      createMany: { data: { date: Date; title: string; colors: string }[] }
    }
  }) {
    return await db.project.create({
      data: data as any,
      include: PROJECT_INCLUDE,
    })
  },

  async update(
    id: string,
    data: Record<string, unknown>,
    include = PROJECT_INCLUDE,
  ) {
    return await db.project.update({ where: { id }, data, include })
  },

  async remove(id: string) {
    return await db.project.delete({ where: { id } })
  },

  async setArchived(id: string, archived: boolean) {
    return await db.project.update({
      where: { id },
      data: { archived },
      include: PROJECT_INCLUDE,
    })
  },
})
