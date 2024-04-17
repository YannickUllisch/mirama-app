import { api } from '@/src/lib/utils'
import React, { useState, type FC } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'

interface TextInputProps {
  id: string
  defaultValue: string
  mutate(): any
}

const TextInput: FC<TextInputProps> = ({ id, defaultValue, mutate }) => {
  const [name, setName] = useState(defaultValue)

  const processInput = (id: string, newValue: string) => {
    if (defaultValue === newValue) {
      return
    }
    if (!/[a-zA-Z0-9]+$/.test(newValue)) {
      toast.error('Given input includes non-allowed characters.')
      return
    }
    try {
      toast.promise(api.put(`projekt?id=${id}`, { name: newValue }), {
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
      onChangeCapture={(e) => setName(e.currentTarget.value)}
      type="text"
      onBlur={() => processInput(id, name)}
    />
  )
}

export default TextInput
