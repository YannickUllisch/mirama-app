import { getDay, startOfMonth, startOfWeek } from 'date-fns'
import type { Event } from '@src/components/Calendar/types/event'
import { daysOfWeek } from '../constants'
import { renderDaysOfWeek } from '../helpers/week-render'
import { renderDaysInMonth } from '../helpers/day-render'

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
