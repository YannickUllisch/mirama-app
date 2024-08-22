import type React from 'react'
import { Button } from '../ui/button'
import { ViewMode } from './types/public-types'

type ViewSwitcherProps = {
  isChecked: boolean
  onViewListChange: (isChecked: boolean) => void
  onViewModeChange: (viewMode: ViewMode) => void
}
export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
}) => {
  return (
    <div className="gap-2 flex p-2">
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <Button
          onClick={() => onViewModeChange(ViewMode.Day)}
          style={{ fontSize: 11, textDecoration: 'none' }}
          variant="link"
        >
          Day
        </Button>
      </div>
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <Button
          onClick={() => onViewModeChange(ViewMode.Week)}
          style={{ fontSize: 11, textDecoration: 'none' }}
          variant="link"
        >
          Week
        </Button>
      </div>
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <Button
          onClick={() => onViewModeChange(ViewMode.Month)}
          style={{ fontSize: 11, textDecoration: 'none' }}
          variant="link"
        >
          Month
        </Button>
      </div>
    </div>
  )
}
