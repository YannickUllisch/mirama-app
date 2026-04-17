import billing from '@src/modules/tenant/billing/hooks/hooks'
import policy from '@src/modules/tenant/iam/policy/hooks/hooks'
import role from '@src/modules/tenant/iam/roles/hooks/hooks'
import organization from '../../modules/organization/hooks/hooks'
import project from '../../modules/project/hooks/hooks'
import { invitation } from '../api/invitation/hooks'
import member from '../api/member/hooks'
import comment from './comment'
import favourite from './favourite'
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
