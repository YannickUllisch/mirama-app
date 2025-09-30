import { api } from '@api'
import { toast } from 'sonner'
import type { KeyedMutator } from 'swr'

export const updateResourceById = async <T, U>(
  route: string,
  id: string,
  params: T,
  options?: {
    mutate?: KeyedMutator<U[]>
    onSuccess?: () => void
  },
) => {
  try {
    toast.promise(api.put(`${route}?id=${id}`, params), {
      loading: 'Updating..',
      error: (error) => error.response?.data.message ?? error.message ?? error,
      success: () => {
        if (options?.mutate) {
          options.mutate()
        }
        if (options?.onSuccess) {
          options.onSuccess
        }
        return 'Successfully Updated Resource!'
      },
    })
  } catch (error: any) {
    toast.error(error)
    throw error.response?.statusText ?? error
  }
}

export const updateResourceByIdNoToast = async <T, U>(
  route: string,
  id: string,
  params: T,
  options?: {
    mutate?: KeyedMutator<U[]>
    onSuccess?: () => void
  },
) => {
  try {
    return await api.put(`${route}?id=${id}`, params).then(() => {
      if (options?.mutate) {
        options.mutate()
      }
      if (options?.onSuccess) {
        options.onSuccess
      }
    })
  } catch (error: any) {
    toast.error(error)
    throw error.response?.data.message ?? error.message ?? error
  }
}
