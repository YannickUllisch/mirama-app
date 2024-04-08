import { api } from '@/src/lib/utils'
import React, { useState, type FC } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'

interface EmailInputProps {
  defaultValue: string
  mutate(): any
}

const EmailInput: FC<EmailInputProps> = ({ defaultValue, mutate }) => {
  const [email, setEmail] = useState(defaultValue)

  const processInput = (newValue: string) => {
    if (!/[a-zA-Z0-9]+$/.test(newValue)) {
      toast.error('Given input includes non-allowed characters.')
      return
    }
    try {
      toast.promise(api.post('user', { email }), {
        loading: 'Adding new Member..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()

          return 'New Member Invited'
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
      placeholder="Enter Email to Invite..."
      onChangeCapture={(e) => setEmail(e.currentTarget.value)}
      type="email"
      onBlur={() => processInput(email)}
    />
  )
}

export default EmailInput
