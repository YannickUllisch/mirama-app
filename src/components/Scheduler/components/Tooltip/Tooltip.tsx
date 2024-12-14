import { type FC, useLayoutEffect, useRef } from 'react'
import {
  StyledContentWrapper,
  StyledInnerWrapper,
  StyledOvertimeWarning,
  StyledText,
  StyledTextWrapper,
  StyledTooltipBeak,
  StyledTooltipContent,
  StyledTooltipWrapper,
} from './styles'
import type { TooltipProps } from './types'
import { dayWidth, weekWidth, zoom2ColumnWidth } from '../../constants'
import { CalendarCheck, CalendarClock } from 'lucide-react'

const Tooltip: FC<TooltipProps> = ({ tooltipData, zoom }) => {
  const { coords, disposition } = tooltipData
  const tooltipRef = useRef<HTMLDivElement>(null)
  let width = weekWidth
  switch (zoom) {
    case 0:
      width = weekWidth
      break
    case 1:
      width = dayWidth
      break
    case 2:
      width = zoom2ColumnWidth
      break
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    // re calculate tooltip width before repaint
    if (!tooltipRef.current) return

    const { width: tooltipWidth } = tooltipRef.current.getBoundingClientRect()

    let xOffset: number
    switch (zoom) {
      case 2:
        xOffset = tooltipWidth / 2 + width
        break
      default:
        xOffset = tooltipWidth / 2 + width / 2
        break
    }
    tooltipRef.current.style.left = `${coords.x - xOffset}px`
    tooltipRef.current.style.top = `${coords.y + 8}px`

    // disposition.overtime affects tooltip's width, thus it's needed to recalculate it's coords whenever overtime changes
  }, [coords.x, width, disposition.overtime, coords.y, zoom])

  return (
    <StyledTooltipWrapper ref={tooltipRef}>
      <StyledTooltipContent>
        <StyledContentWrapper>
          <StyledInnerWrapper>
            <CalendarClock />
            <StyledTextWrapper>
              <StyledText>{`Taken: ${disposition.taken.hours}h ${disposition.taken.minutes}m`}</StyledText>
              {(disposition.overtime.hours > 0 ||
                disposition.overtime.minutes > 0) && (
                <>
                  &nbsp;{'-'}&nbsp;
                  <StyledOvertimeWarning>{`${disposition.overtime.hours}h ${disposition.overtime.minutes}m over`}</StyledOvertimeWarning>
                </>
              )}
            </StyledTextWrapper>
          </StyledInnerWrapper>
          <StyledInnerWrapper>
            <CalendarCheck />
            <StyledTextWrapper>
              <StyledText>{`Free: ${disposition.free.hours}h ${disposition.free.minutes}m`}</StyledText>
            </StyledTextWrapper>
          </StyledInnerWrapper>
        </StyledContentWrapper>
      </StyledTooltipContent>
      <StyledTooltipBeak />
    </StyledTooltipWrapper>
  )
}

export default Tooltip
