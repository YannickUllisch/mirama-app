import { ZoomIn, ZoomOut, Calendar } from 'lucide-react'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { capitalize } from '@src/lib/utils'

interface ViewControlsProps {
  view: 'daily' | 'monthly' | 'quarterly'
  onViewChange: (view: 'daily' | 'monthly' | 'quarterly') => void
}

export function ViewControls({ view, onViewChange }: ViewControlsProps) {
  const handleZoomIn = () => {
    if (view === 'quarterly') onViewChange('monthly')
    else if (view === 'monthly') onViewChange('daily')
  }

  const handleZoomOut = () => {
    if (view === 'daily') onViewChange('monthly')
    else if (view === 'monthly') onViewChange('quarterly')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        disabled={view === 'quarterly'}
        className="h-8 w-8 border-2 border-dashed"
      >
        <ZoomOut className="h-4 w-4 " />
        <span className="sr-only">Zoom Out</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        disabled={view === 'daily'}
        className="h-8 w-8 border-2 border-dashed"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom In</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-8 px-3 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span>{capitalize(view)} View</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onViewChange('daily')}>
            Daily View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('monthly')}>
            Monthly View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('quarterly')}>
            Quarterly View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
