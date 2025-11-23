import type { SimpleTaskResponseType } from '@server/domain/taskSchema'
import { getColorByTaskStatusType } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import { Card, CardContent } from '@ui/card'
import { ChevronRight, FolderTree } from 'lucide-react'
import Link from 'next/link'

interface RelatedWorkTabProps {
  parent?: SimpleTaskResponseType | null
  subtasks?: SimpleTaskResponseType[]
  projectId: string
}

const RelatedWorkTab = ({
  parent,
  subtasks,
  projectId,
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
              <Link
                href={`/app/${projectId}/task/${parent.id}`}
                className="flex items-center justify-between hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{parent.title}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`${getColorByTaskStatusType(parent.status)}`}
                >
                  {parent.status}
                </Badge>
              </Link>
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
                  <Link
                    key={subtask.id}
                    href={`/app/${projectId}/task/${subtask.id}`}
                    className="flex items-center justify-between hover:bg-muted rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{subtask.title}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getColorByTaskStatusType(subtask.status)}`}
                    >
                      {subtask.status}
                    </Badge>
                  </Link>
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
