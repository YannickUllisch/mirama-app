import projectMembers from '@src/modules/pm/projects/members/members.hooks'
import projectMilestones from '@src/modules/pm/projects/milestones/milestones.hooks'
import project from '@src/modules/pm/projects/projects.hooks'
import projectTeams from '@src/modules/pm/projects/teams/teams.hooks'
import projectWorkflow from '@src/modules/pm/projects/workflow/workflow.hooks'
import policy from '@src/modules/tenant/iam/policy/policy.hooks'
import role from '@src/modules/tenant/iam/roles/role.hooks'
import invitation from '@src/modules/tenant/organization/invitations/invitations.hooks'
import members from '@src/modules/tenant/organization/members/members.hooks'
import organization from '@src/modules/tenant/organization/organization.hooks'
import tags from '@src/modules/tenant/organization/tags/tags.hooks'
import team from '@src/modules/tenant/organization/teams/teams.hooks'
import billing from '@src/modules/tenant/tenant/billing/billing.hooks'
import tenant from '@src/modules/tenant/tenant/tenant.hooks'
import user from '@src/modules/tenant/user/user.hooks'
import viewState from '@src/modules/workspace/viewstate.hooks'

const apiRequest = {
  project,
  projectMembers,
  projectWorkflow,
  projectTeams,
  projectMilestones,
  team,
  tags,
  invitation,
  tenant,
  organization,
  billing,
  role,
  policy,
  members,
  user,
  viewState,
}

export default apiRequest
