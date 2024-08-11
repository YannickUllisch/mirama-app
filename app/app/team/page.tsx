'use client'
import EmailInput from '@src/components/Inputs/EmailInput'
import { DataTable } from '@src/components/Tables/DataTable'
import UserAvatar from '@src/components/Header/UserAvatar'
import { Button } from '@src/components/ui/button'
import { SelectItem } from '@src/components/ui/tableSelect'
import { capitalize } from '@src/lib/utils'
import { Role, type User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { useSession } from 'next-auth/react'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { deleteResources } from '@src/lib/api/deleteResource'

const TeamPage = () => {
  const { update } = useSession()

  const {
    data: teamMembers,
    mutate: updateMembers,
    isLoading: membersLoading,
  } = useSWR<User[]>('/api/db/team/member')

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      id: 'nameRowTeam',
      cell: ({ row, getValue }) => {
        return (
          <div key={row.id} className="flex flex-row items-center gap-2">
            <UserAvatar
              username={getValue() as string}
              avatarSize={6}
              fontSize={10}
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
      cell: ({ row, getValue }) => {
        return (
          <GeneralTableSelect
            key={`role${row.id}`}
            id={row.original.id}
            mutate={updateMembers}
            initialValue={capitalize(getValue() as Role)}
            apiRoute="team/member"
            paramToUpdate="role"
            onSuccess={update}
          >
            <SelectItem value={Role.FREELANCE}>
              {capitalize(Role.FREELANCE)}
            </SelectItem>
            <SelectItem value={Role.USER}>{capitalize(Role.USER)}</SelectItem>
            <SelectItem value={Role.ADMIN}>{capitalize(Role.ADMIN)}</SelectItem>
            <SelectItem value={Role.OWNER}>{capitalize(Role.OWNER)}</SelectItem>
          </GeneralTableSelect>
        )
      },
    },
    {
      header: 'Actions',
      id: 'actionsRowTeam',
      cell: ({ row }) => {
        return (
          <Button
            key={`nameInput_${row.index}`}
            variant={'ghost'}
            className="flex items-center"
            onClick={() => deleteMember(row.original.id)}
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
          </Button>
        )
      },
    },
  ]

  const deleteMember = (id: string) => {
    deleteResources('team/member', [id])
    try {
      toast.promise(deleteResources('team/member', [id]), {
        loading: 'Deleting Member..',
        success: () => {
          updateMembers((prev) => prev?.filter((member) => member.id !== id))

          return 'Team Member Removed!'
        },
        error: (err) => err.message ?? err,
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <main className="flex flex-col">
      <div className="mt-8 mb-2">
        <EmailInput mutate={updateMembers} />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={teamMembers ?? []}
          dataLoading={membersLoading}
        />
      </div>
    </main>
  )
}

export default TeamPage
