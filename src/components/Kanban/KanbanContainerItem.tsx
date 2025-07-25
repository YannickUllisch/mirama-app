import { useState, type FC } from 'react'
import { CircleOff } from 'lucide-react'
import { Card, CardContent } from '@ui/card'
import { cn } from '@src/lib/utils'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import type { TaskType } from '@prisma/client'
import ViewTaskSheet from '../Task/ViewTaskSheet'
import type { KeyedMutator } from 'swr'

interface ContainerHeaderProps {
  title: string
  taskType: TaskType | null
  itemCount: number
  className?: string
  id: string
  projectName: string
  mutate: KeyedMutator<any>
}

export const ContainerHeader: FC<ContainerHeaderProps> = ({
  title,
  taskType,
  mutate,
  projectName,
  itemCount,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ViewTaskSheet
        open={isOpen}
        projectName={projectName}
        setOpen={setIsOpen}
        taskId={id.replace('board-', '') ?? ''}
        mutate={mutate}
      />

      <Card
        onClick={() => {
          if (!id.includes('unparented')) {
            setIsOpen((curr) => !curr)
          }
        }}
        className={cn(
          'w-[150px] min-w-[150px] max-w-[150px]',
          'min-h-[100px] group transition-all hover:shadow-md',
          'bg-inherit border-border/50 hover:border-secondary dark:shadow-secondary',
          className,
        )}
      >
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start w-full">
            <div className="min-w-0 flex-1">
              {taskType ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex-shrink-0">
                    {getTaskTypeIcon(taskType)}
                  </div>
                  <span className="font-medium truncate text-sm">{title}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="flex-shrink-0">
                    <CircleOff size={16} />
                  </div>
                  <span className="font-medium text-muted-foreground truncate text-sm">
                    Ungrouped
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-muted-foreground truncate">
              Total Tasks
            </div>
            <div className="text-sm font-medium ml-2 flex-shrink-0">
              {itemCount}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
