'use client'
import React, { type FC, useState } from 'react'
import UserAvatar from './UserAvatar'
import type { User } from '@prisma/client'
import { capitalize, isRoleHigher, isTeamAdminOrOwner } from '@src/lib/utils'
import { Button } from '../ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { deleteResources } from '@src/lib/api/deleteResource'
import type { Session } from 'next-auth'
import ConfirmationDialog from '../Dialogs/ConfirmationDialog'
import type { UpdateSession } from 'next-auth/react'
import EditUserDialog from '../Dialogs/EditUserDialog'

interface UserCardProps {
  user: User
  mutate?: () => any
  session: Session | null
  updateSession: UpdateSession
}

const UserCard: FC<UserCardProps> = ({
  user,
  mutate,
  session,
  updateSession,
}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <div className="flex items-left gap-2 p-2 flex-col">
      <UserAvatar avatarSize={20} username={user.name} fontSize={25} />
      <div className="flex flex-col">
        <span className="text-lg font-bold">{user.name}</span>
        <span className="text-xs text-text-secondary">{user.email}</span>
        <span className="text-sm">{capitalize(user.role ?? 'No role')}</span>
      </div>

      {isTeamAdminOrOwner(session) &&
        !isRoleHigher(user.role, session?.user.role ?? 'USER') && (
          <div>
            <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-transparent text-xs gap-2 border dark:border-neutral-800 dark:hover:bg-neutral-800">
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
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true)
                    setDropDownOpen(false)
                  }}
                >
                  {user.id === session?.user.id ? 'Leave' : 'Remove'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        dialogTitle={'Are you sure?'}
        dialogDesc={'Removing a User is final.'}
        submitButtonText={'Remove'}
        onConfirmation={() =>
          deleteResources('team/member', [user.id], {
            mutate: mutate,
          })
        }
      />

      <EditUserDialog
        updateSession={updateSession}
        user={user}
        key={`edit-user-${user.id}`}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        mutate={mutate}
      />
    </div>
  )
}

export default UserCard
