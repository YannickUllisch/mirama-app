export type ProjectMemberEntry = {
  id: string
  isManager: boolean
  member: { name: string; email: string }
}

export type ProjectWithMembers = {
  id: string
  name: string
  members: ProjectMemberEntry[]
}
