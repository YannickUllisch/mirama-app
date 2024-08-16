import type React from 'react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'
import { cn } from '@src/lib/utils'

interface GeneralSelectProps {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  stylingProps?: {
    triggerclassname?: string
  }
}

const GeneralSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  value,
  setValue,
  stylingProps,
}) => {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className={cn('', stylingProps?.triggerclassname)}>
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralSelect
