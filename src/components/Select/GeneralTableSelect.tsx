import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/tableSelect'
import { useState, type FC, type PropsWithChildren } from 'react'

interface GeneralSelectProps {
  placeholder: string | React.ReactNode
}

export const GeneralTableSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  placeholder,
}) => {
  return (
    <Select>
      <SelectTrigger className="justify-left">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
