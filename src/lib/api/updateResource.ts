import { api } from '@src/lib/api'
import { toast } from 'sonner'

export const updateResourceById = async <T>(
  route: string,
  id: string,
  params: T,
  options?: {
    mutate?: any
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

export const updateResourceByIdNoToast = async <T>(
  route: string,
  id: string,
  params: T,
  options?: {
    mutate?: any
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
