'use client'
import { DataTable } from '@src/components/Tables/DataTable'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import { Button } from '@src/components/ui/button'
import { SelectItem } from '@src/components/ui/tableSelect'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import { Role, type User } from '@prisma/client'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Ellipsis, Plus, Trash2, Users } from 'lucide-react'
import useSWR from 'swr'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { useSession } from 'next-auth/react'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { deleteResources } from '@src/lib/api/deleteResource'
import AddMemberDialog from '@src/components/Dialogs/AddMemberDialog'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'

const TeamPage = () => {
  // Session
  const { data: session, update } = useSession()

  // Fetching Data
  const {
    data: teamMembers,
    mutate: updateMembers,
    isLoading: membersLoading,
  } = useSWR<User[]>('/api/db/team/member')

  // Table States
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: 'name', desc: true },
  ])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: 'name',
      cell: ({ row, getValue }) => {
        return (
          <div key={row.id} className="flex flex-row items-center gap-2">
            <UserAvatar
              username={getValue() as string}
              avatarSize={6}
              fontSize={10}
              toolTip
            />
            {getValue() as string}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      id: 'roleRowTeam',

      cell: ({ getValue, row }) => {
        const [menuOpen, setMenuOpen] = useState(false)
        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex items-center justify-between group w-full">
              <GeneralTableSelect
                key={`role${row.id}`}
                id={row.original.id}
                mutate={updateMembers}
                initialValue={capitalize(getValue() as Role)}
                apiRoute="team/member"
                paramToUpdate="role"
                onSuccess={update}
              >
                {Object.keys(Role).map((role) => (
                  <SelectItem key={`role-item-${role}`} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </GeneralTableSelect>

              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Ellipsis
                    size={28}
                    className={`cursor-pointer ${
                      !menuOpen ? 'invisible group-hover:visible' : 'visible'
                    } bg-neutral-100 dark:bg-neutral-800 p-2 rounded-sm z-50`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      deleteResources('team/member', [row.original.id], {
                        mutate: updateMembers,
                      })
                    }
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        }
        return getValue()
      },
    },
  ]

  return (
    <main className="flex flex-col">
      <div className="flex items-center gap-4 dark:text-white mb-6">
        <Users width={20} />
        <span style={{ fontSize: 20 }}>Team</span>

        {isTeamAdminOrOwner(session) && (
          <>
            <span>|</span>
            <AddMemberDialog mutate={updateMembers}>
              <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                <Plus width={15} className="ml-2" />
                <Button
                  style={{ fontSize: 11, textDecoration: 'none' }}
                  variant="link"
                >
                  Add User
                </Button>
              </div>
            </AddMemberDialog>
          </>
        )}
      </div>

      <DataTable
        columns={columns}
        data={teamMembers ?? []}
        dataLoading={membersLoading}
        sortingState={sortingState}
        setSortingState={setSortingState}
      />
    </main>
  )
}

export default TeamPage
