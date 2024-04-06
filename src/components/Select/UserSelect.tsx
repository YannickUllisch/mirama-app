import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/tableSelect'
import { api } from '@/src/lib/utils'
import type { PriorityType, StatusType } from '@prisma/client'
import { useState, type FC, type PropsWithChildren, useEffect } from 'react'
import { toast } from 'sonner'

interface GeneralSelectProps {
  placeholder: string | React.ReactNode
  mutate(): any
  id: string
}

export const UserSelect: FC<PropsWithChildren<GeneralSelectProps>> = ({
  children,
  placeholder,
  mutate,
  id,
}) => {
  const processSelect = (selectedVal: string) => {
    try {
      toast.promise(api.put(`projekt?id=${id}`, { managedById: selectedVal }), {
        loading: 'Upadating Project..',
        error: (err) => err.response.statusText ?? err,
        success: () => {
          mutate()

          return 'Project Successfully Updated!'
        },
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Select onValueChange={(val) => processSelect(val)}>
      <SelectTrigger className="justify-left">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}
