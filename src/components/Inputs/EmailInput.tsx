import React, { FC, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/src/components/ui/tableInput'
import { Button } from '../ui/button'
import { api } from '@/src/lib/utils'

interface EmailInputProps {
  mutate?(): any
}

const EmailInput: FC<EmailInputProps> = (input) => {
  const [email, setEmail] = useState<string>('')

  const addUser = (newValue: string) => {
    if (newValue === '') return
    if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(newValue)) {
      toast.error('Input must match Email Format')
      return
    }
    try {
      toast.promise(api.post('team/member', { email }), {
        loading: 'Adding new Member..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          if (input.mutate) {
            input.mutate()
          }
          return 'New Member Invited'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div className="flex gap-3">
      <Input
        className="flex dark:bg-inherit dark:text-white placeholder:dark:text-neutral-500 placeholder:text-neutral-400 outline outline-neutral-200 dark:outline-neutral-800 w-72"
        defaultValue={''}
        placeholder="Enter Email to Invite.."
        onChangeCapture={(e) => setEmail(e.currentTarget.value)}
        type="email"
      />
      <Button onClick={() => addUser(email)}>Add Member</Button>
    </div>
  )
}

export default EmailInput
