import { api } from '@api'
import { toast } from 'sonner'
import type { KeyedMutator } from 'swr'

export const deleteResources = async <U>(
  route: string,
  ids: string[],
  options?: {
    mutate?: KeyedMutator<U[]>
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
