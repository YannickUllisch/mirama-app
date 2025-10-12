'use client'
import { Calendar } from '@src/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import { cn } from '@src/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { type FC, useState } from 'react'
import { Button } from '../ui/button'

interface CalendarSelectProps {
  value: Date | undefined | null
  onChange: (date?: Date) => void
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
          className={cn(styling?.calendarClassname)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarSelect
