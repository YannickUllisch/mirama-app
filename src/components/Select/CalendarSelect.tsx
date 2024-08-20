'use client'
import { Calendar } from '@src/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { type FC, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { Button } from '../ui/button'
import { format } from 'date-fns'
import { cn } from '@src/lib/utils'

interface CalendarSelectProps {
  value: Date | undefined | null
  onChange: () => void
  styling?: {
    triggerClassname: string
    calendarClassname: string
  }
}

export const CalendarSelect: FC<CalendarSelectProps> = ({
  value,
  onChange,
  styling,
}) => {
  const [popupOpen, setPopupOpen] = useState<boolean>(false)

  return (
    <Popover
      open={popupOpen}
      onOpenChange={() => setPopupOpen((curr) => !curr)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left bg-transparent',
            styling?.triggerClassname,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          onSelect={onChange}
          selected={value ?? new Date()}
          className={cn(
            'dark:focus:bg-red-500 rounded-md border shadow dark:bg-neutral-900 dark:border-neutral-800',
            styling?.calendarClassname,
          )}
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarSelect
