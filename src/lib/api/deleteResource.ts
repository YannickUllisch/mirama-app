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
  try {
    toast.promise(api.delete(route, { data: ids }), {
      loading: 'Updating..',
      error: (err) => err.response.statusText ?? err,
      success: () => {
        if (options?.mutate) {
          options.mutate()
        }

        return 'Resource Deleted.'
      },
    })
  } catch (error: any) {
    toast.error(error)
    throw error.response?.statusText ?? error
  }
}
