import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/tableSelect'
import { api } from '@/src/lib/utils'
import type { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { FC, PropsWithChildren } from 'react'
import { toast } from 'sonner'
import { Button } from '@src/components/ui/button'

interface RoleSelectProps {
  placeholder: string | React.ReactNode
  mutate(): any
  id: string
}

export const RoleSelect: FC<PropsWithChildren<RoleSelectProps>> = ({
  children,
  placeholder,
  mutate,
  id,
}) => {
  const { update } = useSession()
  const processSelect = (val: string) => {
    try {
      toast.promise(api.put(`team/member?id=${id}`, { role: val as Role }), {
        loading: 'Upadating Role..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()
          update()

          return 'Role Updated!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Select onValueChange={(val) => processSelect(val)}>
      <SelectTrigger className="justify-left">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
