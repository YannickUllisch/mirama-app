import serverApi from '@src/modules/shared/server-api'
import {
  type SidebarBootstrapResponse,
  SidebarBootstrapResponseSchema,
} from './sidebar'

export const fetchSidebarBootstrapServer = async (
  organizationId: string,
): Promise<SidebarBootstrapResponse> => {
  const { data } = await serverApi.get(
    `organization/${organizationId}/sidebar-bootstrap`,
  )
  return SidebarBootstrapResponseSchema.parse(data)
}
