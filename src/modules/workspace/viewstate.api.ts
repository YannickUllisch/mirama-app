import { api } from '@src/modules/shared/api'
import {
  type SidebarBootstrapResponse,
  SidebarBootstrapResponseSchema,
} from './sidebar'
import {
  type SaveViewStateCommand,
  type ViewStateResponse,
  ViewStateResponseSchema,
} from './viewstate.types'

const base = (organizationId: string) =>
  `organization/${organizationId}/view-state`

export const fetchViewStateFn = async (
  organizationId: string,
  surfaceKey: string,
): Promise<ViewStateResponse | null> => {
  const { data } = await api.get(`${base(organizationId)}/${surfaceKey}`)
  return data === null ? null : ViewStateResponseSchema.parse(data)
}

export const fetchViewStatesFn = async (
  organizationId: string,
  surfaceKeys: string[],
): Promise<ViewStateResponse[]> => {
  const { data } = await api.get(base(organizationId), {
    params: { keys: surfaceKeys.join(',') },
  })
  return ViewStateResponseSchema.array().parse(data)
}

export const saveViewStateFn = async (
  organizationId: string,
  surfaceKey: string,
  payload: SaveViewStateCommand,
): Promise<ViewStateResponse> => {
  const { data } = await api.put(
    `${base(organizationId)}/${surfaceKey}`,
    payload,
  )
  return ViewStateResponseSchema.parse(data)
}

export const fetchSidebarBootstrapFn = async (
  organizationId: string,
): Promise<SidebarBootstrapResponse> => {
  const { data } = await api.get(
    `organization/${organizationId}/sidebar-bootstrap`,
  )
  return SidebarBootstrapResponseSchema.parse(data)
}
