'use client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@src/components/ui/button'
import { Input } from '@src/components/ui/input'
import { Label } from '@src/components/ui/label'
import { Separator } from '@src/components/ui/separator'
import { LogOut, UserIcon } from 'lucide-react'
import type { Session } from 'next-auth'
import type { FC } from 'react'

interface AccountTabProps {
  session: Session | null
}

const AccountTab: FC<AccountTabProps> = ({ session }) => {
  return (
    <div className="flex justify-between mb-5 flex-col">
      <div className="justify-between pb-5 grid grid-cols-2">
        <div className="flex flex-col gap-y-2">
          <PageHeader
            icon={UserIcon}
            title="Account"
            description="View and manage your Profile"
          />
          <Label>Profile picture</Label>
          <div className="p-2 flex items-center gap-5 pb-5">
            <UserAvatar
              username={session?.user.name ?? ''}
              avatarSize={80}
              fontSize={30}
            />
          </div>

          <div className="grid grid-cols-2">
            <div className="pb-5 flex flex-col gap-y-3">
              <Label>Profile Name</Label>
              <span className="text-text-secondary text-xs">
                Changes in Name will affect everyone
              </span>
            </div>
            <div className="pb-5 flex flex-col gap-y-3">
              <Input defaultValue={session?.user.name ?? ''} />
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="pb-5 flex flex-col gap-y-3">
              <Label>Profile Email</Label>
              <span className="text-text-secondary text-xs">
                Please contact a system Administrator
              </span>
            </div>
            <div className="pb-5 flex flex-col gap-y-3">
              <Input disabled value={session?.user.email ?? ''} />
            </div>
          </div>

          <div className="pb-5 flex flex-col gap-y-3 max-w-[200px]">
            <Label>Password</Label>
            Coming soon...
          </div>
        </div>
      </div>

      <Separator className="mb-4 mt-4" />
      <div className="flex flex-col pb-10">
        <Label className="text-2xl">General Settings</Label>
        <div className="flex flex-col gap-y-2 pt-4">
          <Label>Date Format</Label>
          <Input disabled value={'dd-MM-yyyy'} />
        </div>
      </div>

      <Separator className="mb-4 mt-4" />
      <div className="flex justify-start flex-col gap-y-5">
        <Label className="text-2xl">Critical Actions</Label>
        <div>
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
              <span>Close Account</span>
            </Button>
          </ConfirmationDialog>
        </div>
      </div>
    </div>
  )
}

export default AccountTab
