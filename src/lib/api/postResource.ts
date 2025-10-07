import { api } from '@src/lib/api'
import { toast } from 'sonner'
import type { KeyedMutator } from 'swr'

export const postResource = async <T, U>(
  route: string,
  params: T,
  options?: {
    mutate?: KeyedMutator<U[]>
  },
  successMessage?: string,
) => {
  try {
    toast.promise(api.post(route, params), {
      loading: 'Creating..',
      error: (err) =>
        err?.response?.data.message ?? err?.message ?? JSON.stringify(err),
      success: () => {
        if (options?.mutate) {
          options.mutate()
        }
        return successMessage ? successMessage : 'Resource Created!'
      },
    })
  } catch (error: any) {
    toast.error(error)
    throw error.response?.statusText ?? error
  }
}
