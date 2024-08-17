'use client'
import React, { type FC } from 'react'
import UserAvatar from '../Avatar/UserAvatar'
import type { Session } from 'next-auth'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface AccountTabProps {
  session: Session | null
}

const AccountTab: FC<AccountTabProps> = ({ session }) => {
  return (
    <>
      <Separator />
      <div className="p-4 flex ">
        <UserAvatar username={session?.user.name ?? ''} avatarSize={10} />

        <Label>Email</Label>
      </div>
    </>
  )
}

export default AccountTab
