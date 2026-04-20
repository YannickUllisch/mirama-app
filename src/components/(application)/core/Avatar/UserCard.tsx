'use client'
import type { MemberResponse } from '@server/modules/account/members/features/response'
import { capitalize } from '@src/lib/utils'
import type { UseMutateFunction } from '@tanstack/react-query'
import { Pencil, PencilLine, Trash2 } from 'lucide-react'
import type { Session } from 'next-auth'
import type { UpdateSession } from 'next-auth/react'
import { type FC, useState } from 'react'
import { ConfirmationDialogWithOpenState } from '../../../Dialogs/ConfirmationDialogWithOpenState'
import EditUserDialog from '../../../Dialogs/EditUserDialog'
import { Button } from '../../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu'
import UserAvatar from './UserAvatar'

interface UserCardProps {
  user: MemberResponse
  session: Session | null
  updateSession: UpdateSession
  deleteMember: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    string,
    {
      previous?: MemberResponse[]
    }
  >
}

const UserCard: FC<UserCardProps> = ({
  user,
  session,
  updateSession,
  deleteMember,
}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <div className="flex items-left gap-2 p-2 flex-col">
      <UserAvatar avatarSize={80} username={user.name} fontSize={25} />
      <div className="flex flex-col">
        <span className="text-lg font-bold">{user.name}</span>
        <span className="text-xs text-text-secondary">{user.email}</span>
        <span className="text-sm">
          {capitalize(user.iamRoleId ?? 'No role')}
        </span>
      </div>

      <div>
        <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-transparent text-text text-xs gap-2 border dark:border-neutral-800 hover:bg-hover dark:hover:bg-neutral-700">
              Edit
              <Pencil className="w-[10px] h-[10px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setEditDialogOpen(true)
                setDropDownOpen(false)
              }}
            >
              <div className="flex items-center gap-2">
                <PencilLine className="w-4 h-4" />
                Edit User
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteDialogOpen(true)
                setDropDownOpen(false)
              }}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {user.id === session?.user.id ? 'Leave' : 'Remove'}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmationDialogWithOpenState
        isOpen={deleteDialogOpen}
        title={'Are you sure?'}
        description={'Removing a User is final.'}
        onCancel={() => setDeleteDialogOpen(false)}
        onSubmit={() => {
          deleteMember(user.id, {
            onSettled: () => {
              setDeleteDialogOpen(false)
            },
          })
        }}
      />

      <EditUserDialog
        updateSession={updateSession}
        user={user}
        key={`edit-user-${user.id}`}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
    </div>
  )
}

export default UserCard
