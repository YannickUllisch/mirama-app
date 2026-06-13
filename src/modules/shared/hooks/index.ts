import project from '@src/modules/project/hooks/hooks'
import comment from '@src/modules/project/task/comments/hooks/hooks'
import task from '@src/modules/project/task/hooks/hooks'
import policy from '@src/modules/tenant/iam/policy/hooks/policy.hooks'
import role from '@src/modules/tenant/iam/roles/hooks/role.hooks'
import invitation from '@src/modules/tenant/organization/invitations/invitations.hooks'
import members from '@src/modules/tenant/organization/members/members.hooks'
import organization from '@src/modules/tenant/organization/organization.hooks'
import tags from '@src/modules/tenant/organization/tags/tags.hooks'
import team from '@src/modules/tenant/organization/teams/teams.hooks'
import billing from '@src/modules/tenant/tenant/billing/billing.hooks'
import tenant from '@src/modules/tenant/tenant/tenant.hooks'

const apiRequest = {
  project,
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
