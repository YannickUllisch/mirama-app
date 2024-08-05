import { api } from '../utils'

export const updateResourceById = async <T>(
  route: string,
  id: string,
  params: T,
) => {
  try {
    return await api.put(`${route}?id=${id}`, params)
  } catch (error: any) {
    throw error.response?.statusText ?? error
  }
}
