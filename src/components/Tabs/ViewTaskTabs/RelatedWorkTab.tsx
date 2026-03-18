import type { SimpleTaskResponseType } from '@server/domain/taskSchema'
import HoverLink from '@src/components/HoverLink'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { getColorByTaskStatusType } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import { Card, CardContent } from '@ui/card'
import { FolderTree } from 'lucide-react'

interface RelatedWorkTabProps {
  parent?: SimpleTaskResponseType | null
  subtasks?: SimpleTaskResponseType[]
  projectName: string
}

const RelatedWorkTab = ({
  parent,
  subtasks,
  projectName,
}: RelatedWorkTabProps) => {
  return (
    <div className="space-y-4 p-4">
      {parent && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Parent Task
          </h3>
          <Card>
            <CardContent className="p-4">
              <HoverLink
                href={`/app/projects/${projectName}/edit/${parent.id}`}
                className="flex items-center justify-between hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getTaskTypeIcon(parent.type)}
                  <span className="text-sm">{parent.title}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getColorByTaskStatusType(parent.status)}`}
                >
                  {parent.status}
                </Badge>
              </HoverLink>
            </CardContent>
          </Card>
        </div>
      )}

      {subtasks && subtasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Subtasks ({subtasks.length})
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <HoverLink
                    key={subtask.id}
                    href={`/app/projects/${projectName}/edit/${subtask.id}`}
                    className="flex items-center justify-between hover:bg-muted rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getTaskTypeIcon(subtask.type)}
                      <span className="text-sm">{subtask.title}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getColorByTaskStatusType(subtask.status)}`}
                    >
                      {subtask.status}
                    </Badge>
                  </HoverLink>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!parent && (!subtasks || subtasks.length === 0) && (
        <div className="text-center text-muted-foreground text-sm p-4">
          No related tasks found
        </div>
      )}
    </div>
  )
}

export default RelatedWorkTab
