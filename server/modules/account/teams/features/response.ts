// server/modules/account/teams/features/response.ts

export type TeamMemberResponse = {
  id: string
  memberId: string
  name: string
  email: string
}

export type TeamResponse = {
  id: string
  name: string
  slug: string
  dateCreated: Date
  memberCount: number
}

export type TeamDetailResponse = Omit<TeamResponse, 'memberCount'> & {
  members: TeamMemberResponse[]
}

type TeamBase = {
  id: string
  name: string
  slug: string
  dateCreated: Date
}

type TeamWithMembers = TeamBase & {
  members: Array<{
    id: string
    memberId: string
    member: { id: string; name: string; email: string }
  }>
}

type TeamMemberRow = {
  id: string
  memberId: string
  member: { id: string; name: string; email: string }
}

export const toTeamResponse = (
  team: TeamBase,
  memberCount: number,
): TeamResponse => ({
  id: team.id,
  name: team.name,
  slug: team.slug,
  dateCreated: team.dateCreated,
  memberCount,
})

export const toTeamDetailResponse = (
  team: TeamWithMembers,
): TeamDetailResponse => ({
  id: team.id,
  name: team.name,
  slug: team.slug,
  dateCreated: team.dateCreated,
  members: team.members.map(toTeamMemberResponse),
})

export const toTeamMemberResponse = (
  row: TeamMemberRow,
): TeamMemberResponse => ({
  id: row.id,
  memberId: row.memberId,
  name: row.member.name,
  email: row.member.email,
})
