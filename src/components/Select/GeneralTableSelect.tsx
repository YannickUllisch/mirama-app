import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'
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
    updateResourceById(
      apiRoute,
      id,
      {
        [paramToUpdate]: val,
      },
      { mutate: mutate, onSuccess: onSuccess },
    )
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
