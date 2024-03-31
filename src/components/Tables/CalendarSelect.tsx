'use client'

import { Calendar } from '@src/components/ui/calendar'
import { type FC, useState } from 'react'

interface CalendarSelectProps {
  startingDate: Date
}

export const CalendarSelect: FC<CalendarSelectProps> = ({ startingDate }) => {
  const [date, setDate] = useState<Date | undefined>(startingDate)

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow"
    />
  )
}

export default CalendarSelect
