'use client'
import { Calendar } from '@src/components/ui/calendar'
import { CalendarDays } from 'lucide-react'
import { type FC, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
import type { Project } from '@prisma/client'
import { toast } from 'sonner'
import { DateTime } from 'luxon'
import { updateResourceById } from '@src/lib/api/updateResource'

interface CalendarTableSelectProps {
  startingDate: Date
  project: Project
  dateType?: string
  mutate?: () => any
}

export const CalendarTableSelect: FC<CalendarTableSelectProps> = ({
  startingDate,
  project,
  dateType,
  mutate,
}) => {
  const [date, setDate] = useState<Date | undefined>(startingDate)
  const [popupOpen, setPopupOpen] = useState(false)

  const handleSelect = (date: Date) => {
    setPopupOpen(false)
    try {
      updateResourceById(
        'project',
        project.id,
        {
          [dateType === 'start' ? 'startDate' : 'endDate']: date,
        },
        { mutate: mutate },
      )
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div className="flex items-center cursor-default justify-center mr-8">
      {date
        ? DateTime.fromISO(new Date(date).toISOString()).toFormat('dd.MM.yyyy')
        : ''}
      <Popover
        open={popupOpen}
        onOpenChange={() => setPopupOpen((curr) => !curr)}
      >
        <PopoverTrigger>
          <CalendarDays className="h-4 w-4 ml-1 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={setDate}
            onDayFocus={handleSelect}
            className="rounded-md border shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CalendarTableSelect
