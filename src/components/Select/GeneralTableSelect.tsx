import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'
import { UserIcon } from 'lucide-react'
import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import { SelectItem } from '../ui/select'

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
  clearable?: boolean
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
  clearable,
}) => {
  const onValueChange = (_val: string) => {
    console.info('TODO: add update resource hook')
    // updateResourceById(
    //   apiRoute,
    //   id,
    //   {
    //     [paramToUpdate]: val === 'undefined' ? 'removeLink' : val,
    //   },
    //   { mutate: mutate, onSuccess: onSuccess },
    // )
  }

  return (
    <Select onValueChange={(val) => onValueChange(val)}>
      <SelectTrigger className={stylingProps?.triggerStyle}>
        <SelectValue placeholder={initialValue} />
      </SelectTrigger>
      <SelectContent align="center">
        <SelectGroup>
          {children}
          {clearable && (
            <SelectItem value={'undefined'}>
              <div className="flex items-center gap-4 ml-1">
                <UserIcon className="w-[18px]" />
                <span>Unassigned</span>
              </div>
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralTableSelect
