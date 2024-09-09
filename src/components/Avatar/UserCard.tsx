'use client'
import React, { type FC, useState } from 'react'
import UserAvatar from './UserAvatar'
import type { User } from '@prisma/client'
import { capitalize, isRoleHigher, isTeamAdminOrOwner } from '@src/lib/utils'
import { Button } from '../ui/button'
import { Delete, Pencil, PencilLine, Trash2 } from 'lucide-react'
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
      <UserAvatar avatarSize={80} username={user.name} fontSize={25} />
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
