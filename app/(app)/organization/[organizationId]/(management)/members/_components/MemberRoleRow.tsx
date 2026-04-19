import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { Badge } from '@ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'
import { ShieldCheck } from 'lucide-react'

export const MemberRoleRow = ({
  member,
  roles,
  canUpdate,
  onRoleChange,
}: {
  member: MemberResponse
  roles: RoleResponse[]
  canUpdate: boolean
  onRoleChange: (roleId: string) => void
}) => (
  <div className="flex items-center justify-between gap-4 px-4 py-2.5">
    <div className="min-w-0">
      <p className="text-sm font-medium truncate">{member.name}</p>
      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
        {member.iamRoleId}
      </Badge>
      {canUpdate ? (
        <Select value={member.iamRoleId ?? ''} onValueChange={onRoleChange}>
          <SelectTrigger className="h-7 text-xs w-40">
            <SelectValue placeholder="No IAM role" />
          </SelectTrigger>
          <SelectContent>
            {roles
              .filter((r) => r.scope === 'ORGANIZATION')
              .map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    {r.name}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-xs text-muted-foreground">
          {roles.find((r) => r.id === member.iamRoleId)?.name ?? 'No role'}
        </span>
      )}
    </div>
  </div>
)
