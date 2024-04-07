'use client'
import { RoleSelect } from '@/src/components/Select/RoleSelect'
import { DataTable } from '@/src/components/Tables/DataTable'
import UserAvatar from '@/src/components/UserAvatar'
import { Button } from '@/src/components/ui/button'
import { Skeleton } from '@/src/components/ui/skeleton'
import { SelectItem } from '@/src/components/ui/tableSelect'
import { api, fetcher } from '@/src/lib/utils'
import { Role, type User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'

const TeamPage = () => {
  const { data: teamMembers, mutate: updateMembers } = useSWR<User[]>(
    '/api/db/team/member',
    fetcher,
  )

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (row) => {
        return (
          <div key={row.cell.id} className="flex flex-row items-center gap-2">
            <UserAvatar username={row.getValue() as string} />
            {row.getValue() as string}{' '}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (row) => {
        return (
          <RoleSelect
            id={row.row.original.id}
            mutate={updateMembers}
            placeholder={row.getValue() as Role}
          >
            <SelectItem value={Role.USER}>{Role.USER}</SelectItem>
            <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
            <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
          </RoleSelect>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: (row) => {
        return (
          <Button
            key={`nameInput_${row.row.index}`}
            variant={'ghost'}
            className="flex items-center"
            onClick={() => deleteRow(row.getValue() as string)}
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
          </Button>
        )
      },
    },
  ]
  const deleteRow = (id: string) => {
    try {
      toast.promise(api.delete(`team/member?id=${id}`), {
        loading: 'Deleting Project..',
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
    <div className="flex flex-col">
      <span style={{ fontSize: 20 }} className="font-bold">
        Team Page
      </span>
      {teamMembers ? (
        <DataTable columns={columns} data={teamMembers} />
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] flex rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 flex" />
            <Skeleton className="h-4 flex" />
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamPage
