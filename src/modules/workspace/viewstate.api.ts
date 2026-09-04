// src/modules/workspace/viewstate.api.ts
import { api } from '@src/modules/shared/api'
import {
  type SaveViewStateCommand,
  type ViewStateResponse,
  ViewStateResponseSchema,
} from './viewstate.types'

const base = (organizationId: string) =>
  `organization/${organizationId}/view-state`

// Nullable-by-design: "no saved state yet" is the normal state for a brand new user or a
// surface nobody has personalized yet - callers fall back to defaults rather than
// branching on a 404.
export const fetchViewStateFn = async (
  organizationId: string,
  surfaceKey: string,
): Promise<ViewStateResponse | null> => {
  const { data } = await api.get(`${base(organizationId)}/${surfaceKey}`)
  return data === null ? null : ViewStateResponseSchema.parse(data)
}

// Bootstrap/batch lookup - fetch every view-state the shell needs for first paint
// (sidebar + whichever tables/boards are about to render) in one round trip. Keys with
// no saved state are simply absent from the result.
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
