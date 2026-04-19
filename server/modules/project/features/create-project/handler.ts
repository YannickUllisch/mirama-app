import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectEntity } from '../../domain/project.entity'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'
import type { CreateProjectRequest } from './schema'

export const CreateProjectCommand =
  ({ db }: AppContext) =>
  async (
    input: CreateProjectRequest,
    organizationId: string,
    creatorEmail: string,
  ) => {
    const repo = ProjectRepository(db)

    const existing = await repo.findByName(input.name)
    ProjectEntity.assertUniqueProjectName(existing)

    const { tags, newTags, members, teams, newMilestones, ...proj } = input

    // ── 1. Resolve creator Member ────────────────────────────────────────────
    const creator = await db.member.findFirst({
      where: { email: creatorEmail },
      select: { id: true, iamRoleId: true },
    })
    const creatorMemberId = creator?.id ?? ''

    // ── 2. Fetch selected teams with their members' IAM roles (single query) ─
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

    // ── 3. Build team-covered member set ─────────────────────────────────────
    const teamMemberIdSet = new Set(
      teamsWithMembers.flatMap((t) => t.members.map((m) => m.memberId)),
    )

    // ── 4. Build inherited ProjectMember rows from teams ────────────────────
    const inheritedMemberData = teamsWithMembers.flatMap((team) =>
      team.members.map((m) => ({
        memberId: m.memberId,
        isManager: false,
        roleId: m.member.iamRoleId,
        isInherited: true,
        teamId: team.id,
        organizationId,
      })),
    )

    // ── 5. Filter direct members — team takes precedence ────────────────────
    const directMemberInputs = members.filter(
      (m) => !teamMemberIdSet.has(m.memberId),
    )

    // ── 6. Resolve roleIds for direct members in one batch query ─────────────
    const directMemberIds = [
      ...new Set(directMemberInputs.map((m) => m.memberId)),
    ]
    const memberRecords =
      directMemberIds.length > 0
        ? await db.member.findMany({
            where: { id: { in: directMemberIds } },
            select: { id: true, iamRoleId: true },
          })
        : []
    const memberRoleMap = new Map(memberRecords.map((m) => [m.id, m.iamRoleId]))

    const directMemberData = directMemberInputs.map((m) => ({
      memberId: m.memberId,
      isManager: m.isManager,
      roleId: memberRoleMap.get(m.memberId) ?? m.roleId ?? '',
      isInherited: false,
      organizationId,
    }))

    // ── 7. Always include creator — inject if not already covered ────────────
    const creatorInAnySlot =
      teamMemberIdSet.has(creatorMemberId) ||
      directMemberData.some((m) => m.memberId === creatorMemberId)

    if (!creatorInAnySlot && creatorMemberId) {
      directMemberData.push({
        memberId: creatorMemberId,
        isManager: true,
        roleId: creator?.iamRoleId ?? '',
        isInherited: false,
        organizationId,
      })
    } else if (creatorMemberId) {
      // Ensure the creator is marked as manager if they're a direct member
      const creatorDirectIdx = directMemberData.findIndex(
        (m) => m.memberId === creatorMemberId,
      )
      const creatorEntry = directMemberData[creatorDirectIdx]
      if (creatorDirectIdx !== -1 && creatorEntry) {
        creatorEntry.isManager = true
      }
    }

    // ── 8. ProjectTeam link rows ─────────────────────────────────────────────
    // Use a default org role for the team-level assignment. Each team member
    // already carries their own iamRoleId in the inherited ProjectMember rows.
    const defaultRole =
      teams.length > 0
        ? await db.role.findFirst({
            where: { scope: 'ORGANIZATION' },
            select: { id: true },
            orderBy: { name: 'asc' },
          })
        : null

    const projectTeamData = teamsWithMembers.map((team) => ({
      teamId: team.id,
      roleId: defaultRole?.id ?? creator?.iamRoleId ?? '',
      organizationId,
    }))

    // ── 9. Create project with all resolved data in one shot ─────────────────
    const allMemberData = [...inheritedMemberData, ...directMemberData]

    const project = await repo.create({
      ...proj,
      organizationId,
      tags: {
        connect: tags.map((id) => ({ id })),
        create: newTags.map((t) => ({ title: t.title, organizationId })),
      },
      members: {
        createMany: { data: allMemberData },
      },
      projectTeams: {
        createMany: { data: projectTeamData },
      },
      milestones: {
        createMany: {
          data: newMilestones.map((ms) => ({ ...ms, organizationId })),
        },
      },
    })

    return toProjectResponse(project)
  }
