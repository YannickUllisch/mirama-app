import type React from 'react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'

interface GeneralSelectProps {
  value: string
  placeholder?: string
  setValue: Dispatch<SetStateAction<string>>
  triggerProps?: React.ComponentPropsWithoutRef<'button'>
}

const GeneralSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  value,
  setValue,
  placeholder,
  triggerProps,
}) => {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger {...triggerProps}>
        <SelectValue placeholder={placeholder ?? value} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralSelect
