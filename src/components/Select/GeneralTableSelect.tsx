import type React from 'react'
import { useState, type FC, type PropsWithChildren } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/tableSelect'
import { updateResourceById } from '@src/lib/api/updateResource'
import ClearButton from '../Buttons/ClearButton'
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
  const onValueChange = async (val: string) => {
    updateResourceById(
      apiRoute,
      id,
      {
        [paramToUpdate]: val === 'undefined' ? undefined : val,
      },
      { mutate: mutate, onSuccess: onSuccess },
    )
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
              <div />
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default GeneralTableSelect
