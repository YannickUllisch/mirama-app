import { api } from '@/src/lib/utils'
import React, { type FC } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'

interface TextInputProps {
  id: string
  defaultValue: string
  mutate(): any
}

const TextInput: FC<TextInputProps> = ({ id, defaultValue, mutate }) => {
  // Cannot save Input into useState, hence we store it in a variable
  let updatedInput = ''

  const processInput = (id: string, newValue: string) => {
    if (!/[a-zA-Z0-9]+$/.test(newValue)) {
      toast.error('Given input includes non-allowed characters.')
      return
    }
    try {
      toast.promise(
        api.put(`projekt?id=${id}`, { name: newValue, budget: newValue }),
        {
          loading: 'Upadting Project..',
          error: (err) => err.response.statusText ?? err,
          success: () => {
            mutate()

            return 'Project Successfully Updated!'
          },
        },
      )
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Input
      className="flex w-24"
      defaultValue={defaultValue}
      // biome-ignore lint/suspicious/noAssignInExpressions: <target value is not assignable to use state, input crashes.>
      onChangeCapture={(e) => (updatedInput = e.currentTarget.value)}
      type="text"
      onBlur={() => processInput(id, updatedInput)}
    />
  )
}

export default TextInput
