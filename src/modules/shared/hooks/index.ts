import projectMembers from '@src/modules/pm/projects/members/members.hooks'
import projectMilestones from '@src/modules/pm/projects/milestones/milestones.hooks'
import project from '@src/modules/pm/projects/projects.hooks'
import projectTeams from '@src/modules/pm/projects/teams/teams.hooks'
import comment from '@src/modules/pm/tasks/comments/taskComment.hooks'
import task from '@src/modules/pm/tasks/tasks.hooks'
import policy from '@src/modules/tenant/iam/policy/policy.hooks'
import role from '@src/modules/tenant/iam/roles/role.hooks'
import invitation from '@src/modules/tenant/organization/invitations/invitations.hooks'
import members from '@src/modules/tenant/organization/members/members.hooks'
import organization from '@src/modules/tenant/organization/organization.hooks'
import tags from '@src/modules/tenant/organization/tags/tags.hooks'
import team from '@src/modules/tenant/organization/teams/teams.hooks'
import billing from '@src/modules/tenant/tenant/billing/billing.hooks'
import tenant from '@src/modules/tenant/tenant/tenant.hooks'

const apiRequest = {
  project,
  projectMembers,
  projectTeams,
  projectMilestones,
  team,
  tags,
  invitation,
  task,
  comment,
  tenant,
  organization,
  billing,
  role,
  policy,
  members,
}

export default apiRequest
