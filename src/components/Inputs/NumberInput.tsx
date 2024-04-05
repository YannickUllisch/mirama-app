import { api } from '@/src/lib/utils'
import React, { type FC } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'

interface NumberInputProps {
  id: string
  defaultValue: number
  mutate(): any
}

const TextInput: FC<NumberInputProps> = ({ id, defaultValue, mutate }) => {
  // Cannot save Input into useState, hence we store it in a variable
  let updatedInput = 0

  const processInput = (id: string, newValue: number) => {
    if (/^[0-9]+$/.test(newValue.toString())) {
      toast.error('Given input includes non-allowed characters.')
      return
    }
    try {
      toast.promise(api.put(`projekt?id=${id}`, { budget: newValue }), {
        loading: 'Upadting Project..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()

          return 'Project Successfully Updated!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Input
      className="flex w-24"
      defaultValue={defaultValue}
      // biome-ignore lint/suspicious/noAssignInExpressions: <target value is not assignable to use state, input crashes.>

      // Missing parse from string to Int
      onChangeCapture={(e) => (updatedInput = e.currentTarget.value)}
      type="number"
      onBlur={() => processInput(id, updatedInput)}
    />
  )
}

export default TextInput
