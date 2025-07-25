import type React from 'react'
import { useEffect, type Dispatch, type FC, type SetStateAction } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { cn } from '@src/lib/utils'

interface GeneralSelectProps {
  value?: string
  placeholder?: string
  setValue: Dispatch<SetStateAction<any>>
  triggerProps?: React.ComponentPropsWithoutRef<'button'>
  items: {
    value: string
    label: string | React.ReactNode
  }[]
}

const GeneralSelect: FC<GeneralSelectProps> = ({
  value,
  setValue,
  placeholder,
  triggerProps,
  items,
}) => {
  useEffect(() => {
    if (!value && items.length > 0) {
      setValue(items[0].value)
    }
  }, [value, items, setValue])
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger
        {...triggerProps}
        className={cn('w-fit gap-2', triggerProps?.className)}
      >
        <SelectValue
          placeholder={placeholder ?? value}
          defaultValue={
            (value ?? items.length > 0) ? items[0].value : undefined
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={`select-item-${item.value}`} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralSelect
