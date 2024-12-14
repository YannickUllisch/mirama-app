import dayjs from 'dayjs'
import { getIsBusinessDay } from '../dates'
import { drawCell } from './drawCell'
import type { Day } from '../../types/global'
import type { Theme } from '../../styles'
import { dayWidth, boxHeight } from '../../constants'

export const drawMonthlyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme,
) => {
  for (let i = 0; i < rows; i++) {
    for (let y = 0; y <= cols; y++) {
      const date = dayjs(
        `${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`,
      ).add(y, 'days')

      const isCurrentDay = date.isSame(dayjs(), 'day')

      drawCell(
        ctx,
        y * dayWidth,
        i * boxHeight,
        dayWidth,
        getIsBusinessDay(date),
        isCurrentDay,
        theme,
      )
    }
  }
}
