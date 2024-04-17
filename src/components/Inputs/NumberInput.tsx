import { api } from '@/src/lib/utils'
import React, { useState, type FC } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'

interface NumberInputProps {
  id: string
  defaultValue: number
  mutate(): any
}

const NumberInput: FC<NumberInputProps> = ({ id, defaultValue, mutate }) => {
  // Cannot save Input into useState, hence we store it in a variable
  const [budget, setBudget] = useState(defaultValue)

  const processInput = (id: string, newValue: number) => {
    if (defaultValue === newValue) {
      return
    }
    if (!/^[0-9]+$/.test(newValue.toString())) {
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
      onChangeCapture={(e) => setBudget(+e.currentTarget.value)}
      type="text"
      onBlur={() => processInput(id, budget)}
    />
  )
}

export default NumberInput
