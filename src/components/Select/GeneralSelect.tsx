import type React from 'react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { View } from 'lucide-react'
import { cn } from '@src/lib/utils'

interface GeneralSelectProps {
  value: string
  placeholder?: string
  setValue: Dispatch<SetStateAction<any>>
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
      <SelectTrigger
        {...triggerProps}
        className={cn('w-fit gap-2', triggerProps?.className)}
      >
        <SelectValue
          placeholder={placeholder ?? value}
          defaultValue={value ?? undefined}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralSelect
