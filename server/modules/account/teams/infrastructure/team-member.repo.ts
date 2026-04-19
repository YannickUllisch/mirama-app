// server/modules/account/teams/infrastructure/team-member.repo.ts
//
// TeamMember is org-scoped (has organizationId). ScopedDb injects it
// automatically on all writes. Reads are safe because ScopedDb filters by org.
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

type TeamMemberRow = {
  id: string
  memberId: string
  member: { id: string; name: string; email: string }
}

const MEMBER_SELECT = {
  id: true,
  memberId: true,
  member: {
    select: { id: true, name: true, email: true },
  },
} as const

export const TeamMemberRepository = (db: ScopedDb) => ({
  async findByTeam(teamId: string): Promise<TeamMemberRow[]> {
    const rows = await db.teamMember.findMany({
      where: { teamId },
      select: MEMBER_SELECT,
      orderBy: { id: 'asc' },
    })
    return rows as unknown as TeamMemberRow[]
  },

  async findOne(teamId: string, memberId: string) {
    return await db.teamMember.findUnique({
      where: { teamId_memberId: { teamId, memberId } },
    })
  },

  async create(teamId: string, memberId: string): Promise<TeamMemberRow> {
    const row = await db.teamMember.create({
      data: {
        teamId,
        memberId,
        organizationId: '',
      },
      select: MEMBER_SELECT,
    })
    return row
  },

  async remove(teamId: string, memberId: string) {
    return await db.teamMember.deleteMany({
      where: { teamId, memberId },
    })
  },
})
