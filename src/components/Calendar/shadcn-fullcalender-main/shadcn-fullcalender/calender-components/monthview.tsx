import { getDay, startOfMonth, startOfWeek } from 'date-fns'
import { daysOfWeek } from '../constants'
import { renderDaysOfWeek } from '../utils/week-render'
import { renderDaysInMonth } from '../utils/day-render'
import type { Event } from '@src/components/Calendar/shadcn-fullcalender-main/shadcn-fullcalender/types/event.tsx'

interface MonthViewProps {
  currentDate: Date
  events: Event[]
}

export function MonthView({ currentDate, events }: MonthViewProps) {
  const startDay = startOfMonth(currentDate)
  const startWeek = startOfWeek(startDay)
  const firstDayIndex = getDay(startDay)
  const reorderedDaysOfWeek = [
    ...daysOfWeek.slice(firstDayIndex),
    ...daysOfWeek.slice(0, firstDayIndex),
  ]

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {renderDaysOfWeek({
        weekDays: reorderedDaysOfWeek,
      })}
      {renderDaysInMonth({
        currentDate,
        events,
        startWeek,
        daysOfWeek,
      })}
    </div>
  )
}
