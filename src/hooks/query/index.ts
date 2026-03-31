import { invitation } from '../api/invitation/hooks'
import organization from '../api/organization/hooks'
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
}

export default apiRequest
