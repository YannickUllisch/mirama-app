import dayjs from 'dayjs'
import type { Theme } from '@src/components/Scheduler/styles'
import type { Day } from '@src/components/Scheduler/types/global'

import { drawRow } from '../../drawRow'
import {
  zoom2HeaderTopRowHeight,
  zoom2HeaderMiddleRowHeight,
  zoom2ColumnWidth,
  zoom2HeaderBottomRowHeight,
  fonts,
} from '@src/components/Scheduler/constants'

export const drawZoom2HoursOnBottom = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme,
) => {
  let xPos = 0
  const yPos = zoom2HeaderTopRowHeight + zoom2HeaderMiddleRowHeight

  const startDateHour = dayjs(
    `${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}T${
      startDate.hour
    }:00:00`,
  )
  const width = zoom2ColumnWidth

  for (let i = 0; i < cols; i++) {
    const hourLabel = startDateHour
      .add(i, 'hours')
      .format('HH:00')
      .toUpperCase()

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: zoom2HeaderBottomRowHeight,
        label: hourLabel,
        font: fonts.bottomRow.number,
        textYPos:
          zoom2HeaderTopRowHeight +
          zoom2HeaderMiddleRowHeight +
          zoom2HeaderBottomRowHeight / 2 +
          2,
        labelBetweenCells: true,
      },
      theme,
    )

    xPos += zoom2ColumnWidth
  }
}
