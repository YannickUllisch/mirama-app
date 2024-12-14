import type { ReactNode } from 'react'
import type dayjs from 'dayjs'
import type {
  Config,
  Coords,
  Day,
  SchedulerData,
  ZoomLevel,
} from '../../types/global'
import type { ParsedDatesRange } from '../../utils/getDatesRange'

export type CalendarContextType = {
  handleGoNext: () => void
  handleScrollNext: () => void
  handleGoPrev: () => void
  handleScrollPrev: () => void
  handleGoToday: () => void
  zoomIn: () => void
  zoomOut: () => void
  handleFilterData: () => void
  updateTilesCoords: (coords: Coords[]) => void
  onClearFilterData?: () => void
  data?: SchedulerData
  tilesCoords: Coords[]
  zoom: ZoomLevel
  isNextZoom: boolean
  isPrevZoom: boolean
  date: dayjs.Dayjs
  isLoading: boolean
  cols: number
  startDate: Day
  dayOfYear: number
  recordsThreshold: number
  config: Config
}

export type CalendarProviderProps = {
  children: ReactNode
  isLoading: boolean
  defaultStartDate?: dayjs.Dayjs
  data?: SchedulerData
  config: Config
  onRangeChange?: (range: ParsedDatesRange) => void
  onFilterData?: () => void
  onClearFilterData?: () => void
}
