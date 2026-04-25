// server/modules/project/infrastructure/project.repo.ts
import type { PriorityType, StatusType } from '@/prisma/generated/client'
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'
import type { MilestoneInput } from '../domain/project.schema'
import type { MemberRow, TeamRow } from '../domain/resolve-project-roster'

const PROJECT_INCLUDE = {
  milestones: true,
  tags: true,
  tasks: true,
  members: { include: { member: true } },
  teams: { include: { team: true } },
} as const

// ── Domain input types ───────────────────────────────────────────────────────

export type ProjectCoreInput = {
  name: string
  description: string | null
  startDate: Date
  endDate: Date
  priority: PriorityType
  status: StatusType
  archived: boolean
  budget: number
  organizationId: string
  tagIds: string[]
}

// Re-export for convenience so callers only need one import
export type { MilestoneInput }

// ── Repository ───────────────────────────────────────────────────────────────

export const ProjectRepository = (db: ScopedDb) => ({
  // ── Queries ────────────────────────────────────────────────────────────────

  async findAll(opts: { memberId: string; archived: boolean }) {
    return db.project.findMany({
      where: {
        archived: opts.archived,
        members: { some: { memberId: opts.memberId } },
      },
      include: PROJECT_INCLUDE,
      orderBy: { name: 'asc' },
    })
  },

  async findById(id: string) {
    return db.project.findFirst({
      where: { id },
      include: PROJECT_INCLUDE,
    })
  },

  async findByName(name: string) {
    return db.project.findFirst({
      where: { name },
      select: { id: true },
    })
  },

  async findProjectMembers(projectId: string) {
    return db.project.findFirst({
      where: { id: projectId },
      select: { members: { select: { memberId: true } } },
    })
  },

  async getAssignees(projectId: string) {
    return db.member.findMany({
      where: { projectLinks: { some: { projectId } } },
    })
  },

  // ── Create ─────────────────────────────────────────────────────────────────
  // Tags must be pre-created before calling this so all tagIds are resolved.
  // Members, teams, and milestones are written via the separate methods below
  // so that ScopedDb can inject the correct context for each model.

  async create(input: ProjectCoreInput) {
    const { tagIds, ...core } = input
    return db.project.create({
      data: {
        ...core,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
      select: { id: true },
    })
  },

  // Members: no organizationId field — scoped through project
  async addMembers(projectId: string, rows: MemberRow[]) {
    if (rows.length === 0) return
    await db.projectMember.createMany({
      data: rows.map((r) => ({ ...r, projectId })),
    })
  },

  // Teams: ProjectTeam has organizationId in schema; caller passes it explicitly.
  // ScopedDb will also inject it, but Prisma's types require it statically.
  async addTeams(projectId: string, organizationId: string, rows: TeamRow[]) {
    if (rows.length === 0) return
    await db.projectTeam.createMany({
      data: rows.map((r) => ({ ...r, projectId, organizationId })),
    })
  },

  // Milestones: no organizationId field — scoped through project
  // Created concurrently so each goes through ScopedDb individually
  async addMilestones(
    projectId: string,
    milestones: Omit<MilestoneInput, 'id'>[],
  ) {
    if (milestones.length === 0) return
    await Promise.all(
      milestones.map((m) => db.milestone.create({ data: { ...m, projectId } })),
    )
  },

  // ── Update helpers ─────────────────────────────────────────────────────────

  async updateCore(id: string, input: Omit<ProjectCoreInput, 'archived'>) {
    const { tagIds, ...core } = input
    return db.project.update({
      where: { id },
      data: {
        ...core,
        tags: { set: tagIds.map((tagId) => ({ id: tagId })) },
      },
    })
  },

  // Delete-then-recreate pattern — safe because the outer withTransaction
  // rolls back everything if any step fails
  async replaceMembers(projectId: string, rows: MemberRow[]) {
    await db.projectMember.deleteMany({ where: { projectId } })
    if (rows.length > 0) {
      await db.projectMember.createMany({
        data: rows.map((r) => ({ ...r, projectId })),
      })
    }
  },

  async replaceTeams(
    projectId: string,
    organizationId: string,
    rows: TeamRow[],
  ) {
    await db.projectTeam.deleteMany({ where: { projectId } })
    if (rows.length > 0) {
      await db.projectTeam.createMany({
        data: rows.map((r) => ({ ...r, projectId, organizationId })),
      })
    }
  },

  // Diffs existing milestones: deletes removed ones, updates existing ones,
  // and creates new ones (those without an id) — all concurrently
  async syncMilestones(projectId: string, milestones: MilestoneInput[]) {
    const existing = await db.milestone.findMany({
      where: { projectId },
      select: { id: true },
    })

    const incomingIds = new Set(
      milestones.filter((m) => m.id).map((m) => m.id as string),
    )
    const toDelete = existing
      .filter((m) => !incomingIds.has(m.id))
      .map((m) => m.id)

    await Promise.all([
      toDelete.length > 0
        ? db.milestone.deleteMany({ where: { id: { in: toDelete } } })
        : Promise.resolve(),
      ...milestones.map((m) =>
        m.id
          ? db.milestone.update({
              where: { id: m.id },
              data: { date: m.date, title: m.title, colors: m.colors },
            })
          : db.milestone.create({
              data: {
                date: m.date,
                title: m.title,
                colors: m.colors,
                projectId,
              },
            }),
      ),
    ])
  },

  // ── Other mutations ────────────────────────────────────────────────────────

  async remove(id: string) {
    return db.project.delete({ where: { id } })
  },

  async setArchived(id: string, archived: boolean) {
    return db.project.update({
      where: { id },
      data: { archived },
      include: PROJECT_INCLUDE,
    })
  },
})
