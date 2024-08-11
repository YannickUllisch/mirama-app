import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'
import { toast } from 'sonner'
import { updateResourceById } from '@src/lib/api/updateResource'

interface GeneralTableSelectProps {
  initialValue: string | React.ReactNode
  id: string
  apiRoute: string
  paramToUpdate: string
  mutate?(): any
  onSuccess?(): any
  stylingProps?: {
    triggerStyle?: string
  }
}

const GeneralTableSelect: FC<PropsWithChildren<GeneralTableSelectProps>> = ({
  children,
  initialValue,
  mutate,
  id,
  apiRoute,
  paramToUpdate,
  onSuccess,
  stylingProps,
}) => {
  const onValueChange = async (val: string) => {
    try {
      toast.promise(
        updateResourceById(apiRoute, id, {
          [paramToUpdate]: val,
        }),
        {
          loading: 'Updating...',
          error: (err) => err,
          success: () => {
            // Mutate updates the fetched data, which then updates the table value.
            if (mutate) {
              mutate()
            }
            if (onSuccess) {
              onSuccess()
            }
            return 'Successfully Updated!'
          },
        },
      )
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Select onValueChange={(val) => onValueChange(val)}>
      <SelectTrigger className={stylingProps?.triggerStyle}>
        <SelectValue placeholder={initialValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralTableSelect
