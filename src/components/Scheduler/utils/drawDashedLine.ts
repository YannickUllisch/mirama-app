import type { Theme } from '../styles'

export const drawDashedLine = (
  ctx: CanvasRenderingContext2D,
  startPos: number,
  lineLength: number,
  theme: Theme,
) => {
  ctx.setLineDash([5, 5])
  ctx.moveTo(startPos + 0.5, 0.5)
  ctx.lineTo(startPos + 0.5, lineLength + 0.5)
  ctx.stroke()
}
