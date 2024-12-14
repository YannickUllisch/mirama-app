import { forwardRef, useCallback, useEffect, useRef } from 'react'
import {
  StyledCanvas,
  StyledInnerWrapper,
  StyledSpan,
  StyledWrapper,
} from './styles'
import type { GridProps } from './types'
import { useCalendar } from '@src/components/Scheduler/context/CalendarProvider'
import { getCanvasWidth } from '@src/components/Scheduler/utils/getCanvasWidth'
import {
  boxHeight,
  canvasWrapperId,
  leftColumnWidth,
  outsideWrapperId,
} from '@src/components/Scheduler/constants'
import { resizeCanvas } from '@src/components/Scheduler/utils/resizeCanvas'
import { drawGrid } from '@src/components/Scheduler/utils/drawGrid/drawGrid'
import Tiles from '../../Tiles'
import Loader from '../../Loader'
import { useTheme } from 'styled-components'

const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { zoom, rows, data, onTileClick },
  ref,
) {
  const {
    handleScrollNext,
    handleScrollPrev,
    date,
    isLoading,
    cols,
    startDate,
  } = useCalendar()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const refRight = useRef<HTMLSpanElement>(null)
  const refLeft = useRef<HTMLSpanElement>(null)

  const { theme } = useTheme()

  const handleResize = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const width = getCanvasWidth()
      const height = rows * boxHeight + 1
      resizeCanvas(ctx, width, height)
      drawGrid(ctx, zoom, rows, cols, startDate, theme)
    },
    [cols, startDate, rows, zoom, theme],
  )

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const onResize = () => handleResize(ctx)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [handleResize])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.style.letterSpacing = '1px'
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    handleResize(ctx)
  }, [date, rows, zoom, handleResize])

  useEffect(() => {
    if (!refRight.current || !document) return
    const observerRight = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollNext() : null),
      { root: document.getElementById(outsideWrapperId) },
    )
    observerRight.observe(refRight.current)

    return () => observerRight.disconnect()
  }, [handleScrollNext])

  useEffect(() => {
    if (!refLeft.current || !document) return
    const observerLeft = new IntersectionObserver(
      (e) => (e[0].isIntersecting ? handleScrollPrev() : null),
      {
        root: document.getElementById(outsideWrapperId),
        rootMargin: `0px 0px 0px -${leftColumnWidth}px`,
      },
    )
    observerLeft.observe(refLeft.current)

    return () => observerLeft.disconnect()
  }, [handleScrollPrev])

  return (
    <StyledWrapper id={canvasWrapperId}>
      <StyledInnerWrapper ref={ref}>
        <StyledSpan position="left" ref={refLeft} />
        <Loader isLoading={isLoading} position="left" />
        <StyledCanvas ref={canvasRef} />
        <Tiles data={data} zoom={zoom} onTileClick={onTileClick} />
        <StyledSpan ref={refRight} position="right" />
        <Loader isLoading={isLoading} position="right" />
      </StyledInnerWrapper>
    </StyledWrapper>
  )
})

export default Grid
