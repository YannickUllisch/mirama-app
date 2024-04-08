import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/tableSelect'
import { api } from '@/src/lib/utils'
import type { FC, PropsWithChildren } from 'react'
import { toast } from 'sonner'

interface PrioritySelectProps {
  placeholder: string | React.ReactNode
  mutate(): any
  id: string
}

export const PrioritySelect: FC<PropsWithChildren<PrioritySelectProps>> = ({
  children,
  placeholder,
  mutate,
  id,
}) => {
  const processSelect = (val: string) => {
    try {
      toast.promise(api.put(`projekt?id=${id}`, { priority: val }), {
        loading: 'Upadating Project..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()

          return 'Priority Successfully Updated!'
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
