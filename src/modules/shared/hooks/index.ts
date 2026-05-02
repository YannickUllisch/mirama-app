import project from '@src/modules/project/hooks/hooks'
import comment from '@src/modules/project/task/comments/hooks/hooks'
import task from '@src/modules/project/task/hooks/hooks'
import billing from '@src/modules/tenant/billing/hooks/hooks'
import policy from '@src/modules/tenant/iam/policy/hooks/hooks'
import role from '@src/modules/tenant/iam/roles/hooks/hooks'
import organization from '@src/modules/tenant/organization/hooks/hooks'
import { invitation } from '@src/modules/tenant/organization/invitations/hooks/hooks'
import members from '@src/modules/tenant/organization/members/hooks/hooks'
import tag from '@src/modules/tenant/organization/tags/hooks/hooks'
import team from '@src/modules/tenant/organization/teams/hooks/hooks'

const apiRequest = {
  project,
  team,
  tag,
  invitation,
  task,
  comment,
  organization,
  billing,
  role,
  policy,
  members,
}

export default apiRequest
