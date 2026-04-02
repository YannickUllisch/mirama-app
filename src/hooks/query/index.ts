import { invitation } from '../api/invitation/hooks'
import member from '../api/member/hooks'
import organization from '../api/organization/hooks'
import policy from '../api/policy/hooks'
import role from '../api/role/hooks'
import billing from '../api/tenant/billing/hooks'
import comment from './comment'
import favourite from './favourite'
import project from './project'
import tag from './tag'
import task from './task'
import team from './team'

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
  member,
}

export default apiRequest
