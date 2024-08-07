import { api } from '@api'

export const deleteResources = async (route: string, ids: string[]) => {
  try {
    return await api.delete(route, { data: ids })
  } catch (error: any) {
    throw error.response?.statusText ?? error
  }
}
