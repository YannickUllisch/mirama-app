'use client'

import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import type { RoleResponse } from '@src/modules/tenant/iam/roles/role.types'
import type { MemberResponse } from '@src/modules/tenant/organization/members/members.types'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'

const ROW_COLORS = [
  'bg-signature-coral',
  'bg-signature-forest',
  'bg-signature-peach',
  'bg-signature-mint',
  'bg-signature-yellow',
  'bg-signature-mustard',
] as const

const columnHelper = createColumnHelper<MemberResponse>()

export const useOrgMemberColumns = ({
  roles,
  canUpdate,
  onRoleChange,
}: {
  roles: RoleResponse[]
  canUpdate: boolean
  onRoleChange: (memberId: string, roleId: string) => void
}) => {
  return useMemo(
    () => [
      columnHelper.display({
        id: '_color',
        size: 8,
        minSize: 8,
        maxSize: 8,
        cell: ({ row }) => (
          <div
            className={`w-1.5 h-7 rounded-full mx-auto ${ROW_COLORS[row.index % ROW_COLORS.length]}`}
          />
        ),
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground text-sm">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const currentRole = roles.find(
            (r) => r.id === row.original.iamRoleIds[0],
          )
          if (canUpdate) {
            return (
              <Select
                value={row.original.iamRoleIds[0] ?? ''}
                onValueChange={(roleId) =>
                  onRoleChange(row.original.id, roleId)
                }
              >
                <SelectTrigger className="h-7 text-xs w-44">
                  <SelectValue placeholder="No role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                        {r.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
          return currentRole ? (
            <Badge variant="secondary" className="text-[10px] font-mono">
              {currentRole.name}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">No role</span>
          )
        },
      }),
    ],
    [roles, canUpdate, onRoleChange],
  )
}
