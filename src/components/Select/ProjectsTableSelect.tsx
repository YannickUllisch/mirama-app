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

interface ProjectTableSelectProps {
  placeholder: string | React.ReactNode
  mutate(): any
  id: string
  priority?: boolean
  status?: boolean
}

export const ProjectTableSelect: FC<
  PropsWithChildren<ProjectTableSelectProps>
> = ({ children, placeholder, priority, mutate, id }) => {
  const processSelect = (val: string) => {
    try {
      const update = priority ? { priority: val } : { status: val }

      toast.promise(api.put(`projekt?id=${id}`, update), {
        loading: 'Upadating Project..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()

          return 'Project Successfully Updated!'
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
