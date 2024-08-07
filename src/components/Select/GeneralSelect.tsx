import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'

interface GeneralSelectProps {
  initialValue: string | React.ReactNode
  id: string
  onSuccess?(): any
  stylingProps?: {
    triggerStyle?: string
  }
}

const GeneralSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  initialValue,
  onSuccess,
  stylingProps,
}) => {
  return (
    <Select onValueChange={(val) => ''}>
      <SelectTrigger className={stylingProps?.triggerStyle}>
        <SelectValue placeholder={initialValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralSelect
