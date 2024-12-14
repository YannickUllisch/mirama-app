import type { FC } from 'react'
import {
  StyledDescription,
  StyledStickyWrapper,
  StyledText,
  StyledTextWrapper,
  StyledTileWrapper,
} from './styles'
import type { TileProps } from './types'
import { useCalendar } from '@src/components/Scheduler/context/CalendarProvider'
import { getDatesRange } from '@src/components/Scheduler/utils/getDatesRange'
import { getTileProperties } from '@src/components/Scheduler/utils/getTileProperties'
import { useTheme } from 'styled-components'
import { getTileTextColor } from '@src/components/Scheduler/utils/getTileTextColor'

const Tile: FC<TileProps> = ({ row, data, zoom, onTileClick }) => {
  const { date } = useCalendar()
  const datesRange = getDatesRange(date, zoom)
  const { y, x, width } = getTileProperties(
    row,
    datesRange.startDate,
    datesRange.endDate,
    data.startDate,
    data.endDate,
    zoom,
  )

  const { colors } = useTheme()

  return (
    <StyledTileWrapper
      style={{
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: `${data.bgColor ?? colors.defaultTile}`,
        width: `${width}px`,
        color: getTileTextColor(data.bgColor ?? ''),
      }}
      onClick={() => onTileClick?.(data)}
    >
      <StyledTextWrapper>
        <StyledStickyWrapper>
          <StyledText bold>{data.title}</StyledText>
          <StyledText>{data.subtitle}</StyledText>
          <StyledDescription>{data.description}</StyledDescription>
        </StyledStickyWrapper>
      </StyledTextWrapper>
    </StyledTileWrapper>
  )
}

export default Tile
