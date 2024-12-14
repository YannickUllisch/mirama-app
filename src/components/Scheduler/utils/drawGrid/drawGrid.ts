import { drawMonthlyView } from './drawMonthlyView'
import { drawYearlyView } from './drawYearlyView'
import { drawHourlyView } from './drawHourlyView'
import type { Theme } from '../../styles'
import type { Day } from '../../types/global'
import { canvasWrapperId } from '../../constants'

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  zoom: number,
  rows: number,
  cols: number,
  parsedStartDate: Day,
  theme: Theme,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  if (!document) return
  const canvasWrapper = document.getElementById(canvasWrapperId)
  if (!canvasWrapper) return

  switch (zoom) {
    case 0:
      drawYearlyView(ctx, rows, cols, parsedStartDate, theme)
      break
    case 1:
      drawMonthlyView(ctx, rows, cols, parsedStartDate, theme)
      break
    case 2:
      drawHourlyView(ctx, rows, cols, parsedStartDate, theme)
      break
  }
}
