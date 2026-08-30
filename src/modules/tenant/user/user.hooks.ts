import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUserFn } from './user.api'
import type { UpdateUserCommand, UserResponse } from './user.types'

const user = {
  update: {
    useMutation: () => {
      type Vars = { id: string; data: UpdateUserCommand }

      return useMutation<UserResponse, Error, Vars>({
        mutationFn: ({ id, data }) => updateUserFn(id, data),
        onSuccess: () => {
          toast.success('User updated')
        },
        onError: (err) => {
          toast.error(err?.message || 'An error occurred')
        },
      })
    },
  },
}

export default user
