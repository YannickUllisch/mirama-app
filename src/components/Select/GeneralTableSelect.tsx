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
  projectId?: string
}

export const GeneralTableSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  placeholder,
}) => {
  const [_selectedPriority, setSelectedPriority] = useState<string>(
    placeholder as string,
  )

  //console.log(selectedPriority)

  return (
    <Select onValueChange={setSelectedPriority}>
      <SelectTrigger className="justify-left">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
