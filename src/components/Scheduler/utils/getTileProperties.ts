import dayjs from 'dayjs'
import { getTileXAndWidth } from './getTileXAndWidth'
import { boxHeight, tileYOffset } from '../constants'
import type { TileProperties } from '../types/global'

export const getTileProperties = (
  row: number,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  resourceStartDate: Date,
  resourceEndDate: Date,
  zoom: number,
): TileProperties => {
  const y = row * boxHeight + tileYOffset
  const rangeStartHour = startDate.hour()
  const rangeEndHour = endDate.hour()
  let parsedResourceStartDate: dayjs.Dayjs
  let parsedResourceEndDate: dayjs.Dayjs
  let parsedStartDate: dayjs.Dayjs
  let parsedEndDate: dayjs.Dayjs

  switch (zoom) {
    case 2: {
      parsedResourceStartDate = dayjs(resourceStartDate)
      parsedResourceEndDate = dayjs(resourceEndDate)
      parsedStartDate = dayjs(startDate).hour(rangeStartHour).minute(0)
      parsedEndDate = dayjs(endDate).hour(rangeEndHour).minute(0)
      break
    }
    default: {
      parsedResourceStartDate = dayjs(resourceStartDate).hour(0).minute(0)
      parsedResourceEndDate = dayjs(resourceEndDate).hour(23).minute(59)
      parsedStartDate = startDate
      parsedEndDate = endDate
      break
    }
  }

  return {
    ...getTileXAndWidth(
      { startDate: parsedResourceStartDate, endDate: parsedResourceEndDate },
      { startDate: parsedStartDate, endDate: parsedEndDate },
      zoom,
    ),
    y,
  }
}
