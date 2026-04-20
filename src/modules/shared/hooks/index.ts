import organization from '@src/modules/organization/hooks/hooks'
import { invitation } from '@src/modules/organization/invitations/hooks/hooks'
import members from '@src/modules/organization/members/hooks/hooks'
import tag from '@src/modules/organization/tags/hooks/hooks'
import team from '@src/modules/organization/teams/hooks/hooks'
import project from '@src/modules/project/hooks/hooks'
import comment from '@src/modules/project/task/comments/hooks/hooks'
import task from '@src/modules/project/task/hooks/hooks'
import favourite from '@src/modules/shared/favourites/hooks/hooks'
import billing from '@src/modules/tenant/billing/hooks/hooks'
import policy from '@src/modules/tenant/iam/policy/hooks/hooks'
import role from '@src/modules/tenant/iam/roles/hooks/hooks'

const apiRequest = {
  project,
  team,
  tag,
  favourite,
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
