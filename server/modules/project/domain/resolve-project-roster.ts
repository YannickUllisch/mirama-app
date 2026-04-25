// server/modules/project/domain/resolve-project-roster.ts
import type { ScopedDb } from '@server/shared/infrastructure/scoped-db'

export type MemberRow = {
  memberId: string
  roleId: string
  isInherited: boolean
  teamId?: string
}

export type TeamRow = {
  teamId: string
  roleId: string
}

type MemberLink = { memberId: string; roleId?: string }
type TeamLink = { teamId: string }

/**
 * Resolves the full set of ProjectMember and ProjectTeam rows for a given
 * member/team input. Handles role lookup, team-member inheritance, and
 * optional creator injection (create flow only).
 */
export const resolveProjectRoster = async (
  db: ScopedDb,
  opts: {
    members: MemberLink[]
    teams: TeamLink[]
    creatorMemberId?: string
    creatorIamRoleId?: string
  },
): Promise<{ memberRows: MemberRow[]; teamRows: TeamRow[] }> => {
  const { members, teams, creatorMemberId, creatorIamRoleId } = opts

  // ── 1. Fetch selected teams with their members' IAM roles ─────────────────
  const teamsWithMembers =
    teams.length > 0
      ? await db.team.findMany({
          where: { id: { in: teams.map((t) => t.teamId) } },
          include: {
            members: {
              select: {
                memberId: true,
                member: { select: { iamRoleId: true } },
              },
            },
          },
        })
      : []

  const teamMemberSet = new Set(
    teamsWithMembers.flatMap((t) => t.members.map((m) => m.memberId)),
  )

  // ── 2. Build inherited ProjectMember rows from teams ──────────────────────
  const inherited: MemberRow[] = teamsWithMembers.flatMap((team) =>
    team.members.map((m) => ({
      memberId: m.memberId,
      roleId: m.member.iamRoleId,
      isInherited: true,
      teamId: team.id,
    })),
  )

  // ── 3. Resolve direct members — skip those already covered by a team ──────
  const directCandidates = members.filter((m) => !teamMemberSet.has(m.memberId))
  const directIds = [...new Set(directCandidates.map((m) => m.memberId))]

  const roleMap = new Map(
    directIds.length > 0
      ? (
          await db.member.findMany({
            where: { id: { in: directIds } },
            select: { id: true, iamRoleId: true },
          })
        ).map((m) => [m.id, m.iamRoleId])
      : [],
  )

  const direct: MemberRow[] = directCandidates.map((m) => ({
    memberId: m.memberId,
    roleId: roleMap.get(m.memberId) ?? m.roleId ?? '',
    isInherited: false,
  }))

  // ── 4. Always include creator on create (inject if not already covered) ───
  if (
    creatorMemberId &&
    !teamMemberSet.has(creatorMemberId) &&
    !direct.some((m) => m.memberId === creatorMemberId)
  ) {
    direct.push({
      memberId: creatorMemberId,
      roleId: creatorIamRoleId ?? '',
      isInherited: false,
    })
  }

  // ── 5. Resolve a default org role for ProjectTeam rows ────────────────────
  const defaultRole =
    teams.length > 0
      ? await db.role.findFirst({
          where: { scope: 'ORGANIZATION' },
          select: { id: true },
          orderBy: { name: 'asc' },
        })
      : null

  const teamRows: TeamRow[] = teamsWithMembers.map((t) => ({
    teamId: t.id,
    roleId: defaultRole?.id ?? creatorIamRoleId ?? '',
  }))

  return { memberRows: [...inherited, ...direct], teamRows }
}
