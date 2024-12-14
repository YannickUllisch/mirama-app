import { boxHeight } from '../../constants'
import type { Theme } from '../../styles'

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  isBusinessDay: boolean,
  isCurrentDay: boolean,
  theme: Theme,
) => {
  ctx.beginPath()
  ctx.setLineDash([])
  ctx.fillRect(x, y, width, boxHeight)
  ctx.strokeRect(x + 0.5, y + 0.5, width, boxHeight)
}
