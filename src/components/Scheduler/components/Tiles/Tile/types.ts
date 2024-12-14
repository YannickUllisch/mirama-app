import type { SchedulerProjectData } from '@src/components/Scheduler'

export type TileProps = {
  row: number
  data: SchedulerProjectData
  zoom: number
  onTileClick?: (data: SchedulerProjectData) => void
}

export type StyledTextProps = {
  bold?: boolean
}
