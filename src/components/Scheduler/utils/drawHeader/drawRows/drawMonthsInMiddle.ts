import dayjs from 'dayjs'

import { drawRow } from '../../drawRow'
import type { Theme } from '@src/components/Scheduler/styles'
import type { Day } from '@src/components/Scheduler/types/global'
import {
  singleDayWidth,
  headerMonthHeight,
  monthsInYear,
  headerWeekHeight,
  middleRowTextYPos,
  fonts,
} from '@src/components/Scheduler/constants'
import { getDaysInMonths } from '../../dates'

export const drawMonthsInMiddle = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme,
) => {
  let xPos = -(startDate.dayOfMonth - 1) * singleDayWidth
  const yPos = headerMonthHeight
  const monthIndex = startDate.month
  let index = monthIndex

  for (let i = 0; i < cols; i++) {
    if (index >= monthsInYear) index = 0
    const width = getDaysInMonths(startDate, i) * singleDayWidth

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerWeekHeight,
        textYPos: middleRowTextYPos,
        label: dayjs().month(index).format('MMMM').toUpperCase(),
        font: fonts.bottomRow.number,
      },
      theme,
    )
    xPos += width
    index++
  }
}
