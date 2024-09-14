'use client'
import React, { type FC } from 'react'
import UserAvatar from '../Avatar/UserAvatar'
import type { Session } from 'next-auth'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'
import { Button } from '../ui/button'
import { ExitFullScreenIcon } from '@radix-ui/react-icons'
import { LogOut } from 'lucide-react'

interface AccountTabProps {
  session: Session | null
}

const AccountTab: FC<AccountTabProps> = ({ session }) => {
  return (
    <div className="flex justify-between mb-5 flex-col">
      <div className="flex justify-between pb-10 ">
        <div className="flex flex-col gap-y-2">
          <span className="font-medium text-2xl">Account Settings</span>
          <Label>Profile picture</Label>
          <div className="p-2 flex items-center gap-5">
            <UserAvatar
              username={session?.user.name ?? ''}
              avatarSize={80}
              fontSize={30}
            />
            <div className="flex gap-2">
              <Button variant={'outline'}>Change Picture</Button>
              <Button variant={'destructive'}>Delete Picture</Button>
            </div>
          </div>
          <Label>Profile Name</Label>
          <Input value={session?.user.name ?? ''} />

          <Label>Email</Label>
          <Input disabled value={session?.user.email ?? ''} />
        </div>
      </div>

      <Separator className="mb-4 mt-4" />
      <div className="flex flex-col">
        <Label>Date Format</Label>
        <Input disabled value={'dd-MM-yyyy'} />
      </div>

      <div className="flex justify-start gap-2">
        <ConfirmationDialog
          dialogTitle={'Are you sure?'}
          dialogDesc={'Removing your Account can not be undone.'}
          submitButtonText={'Delete'}
          onConfirmation={() => undefined}
        >
          <Button
            className="gap-2 hover:text-red-500 hover:no-underline hover:bg-hover"
            variant={'destructive'}
          >
            <LogOut className="w-3.5 h-3.5 cursor-pointer" />
            <span>Delete Account</span>
          </Button>
        </ConfirmationDialog>
      </div>
    </div>
  )
}

export default AccountTab
