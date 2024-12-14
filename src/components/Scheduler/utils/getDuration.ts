import dayjs from 'dayjs'
import type { TimeUnits } from '../types/global'

export const getDuration = (seconds: number): TimeUnits => {
  const duration = dayjs.duration(seconds, 'seconds')
  const itemHours = duration.hours()
  const itemMinutes = duration.minutes()

  return { hours: itemHours, minutes: itemMinutes }
}
