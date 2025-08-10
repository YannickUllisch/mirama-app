import type { FC } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { capitalize } from '@src/lib/utils'
import { Button } from '@src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import Link from 'next/link'
import { getTaskTypeIcon } from '../../lib/helpers/TaskTypeIcons'
import {
  containerTaskTypes,
  individualTaskTypes,
} from '@src/lib/helpers/TaskTypeHelpers'

interface TaskTypeCreateProps {
  projectName: string
}

const TaskTypeCreate: FC<TaskTypeCreateProps> = ({ projectName }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center border-dashed border-2  hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer px-2">
          <Plus width={15} />
          <Button
            style={{ fontSize: 11, textDecoration: 'none' }}
            variant="link"
            size={'sm'}
          >
            New Task
          </Button>
          <ChevronDown size={15} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-xs">
          Container Types
        </DropdownMenuLabel>
        {containerTaskTypes.map((type) => (
          <DropdownMenuItem key={`select-container-${type}`} asChild>
            <Link
              href={`/app/projects/${projectName}/create/${type.toLowerCase()}`}
              className="flex gap-2"
            >
              {getTaskTypeIcon(type)}
              {capitalize(type)}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">
          Individual Types
        </DropdownMenuLabel>
        {/* Render Individual Tasks */}
        {individualTaskTypes.map((type) => (
          <DropdownMenuItem key={`select-individual-${type}`} asChild>
            <Link
              href={`/app/projects/${projectName}/create/${type.toLowerCase()}`}
              className="flex gap-2"
            >
              {getTaskTypeIcon(type)}
              {capitalize(type)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TaskTypeCreate
