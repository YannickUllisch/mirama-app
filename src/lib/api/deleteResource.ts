import { api } from '@src/lib/api'
import { toast } from 'sonner'

export const deleteResources = async (
  route: string,
  ids: string[],
  options?: {
    mutate?: any
  },
) => {
  api
    .delete(route, { data: ids })
    .then(() => {
      if (options?.mutate) {
        options.mutate()
      }
    })
    .catch((error) => {
      toast.error(error)
      throw error.response?.statusText ?? error
    })
}
