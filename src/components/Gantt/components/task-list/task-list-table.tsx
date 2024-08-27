import type React from 'react'
import type { Task } from '../../types/public-types'
import { ChevronRight } from 'lucide-react'
import { DateTime } from 'luxon'

export const TaskListTableDefault: React.FC<{
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
}) => {
  return (
    <div
      className="table border-b-2 border-l-2 overflow-x-scroll"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((task) => {
        let expanderSymbol = ''
        if (task.hideChildren === false) {
          expanderSymbol = '▼'
        } else if (task.hideChildren === true) {
          expanderSymbol = '▶'
        }

        return (
          <div
            className="table-row text-ellipsis shadow-sm"
            style={{ height: rowHeight }}
            key={`${task.id}row`}
          >
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={task.name}
            >
              <div className="flex">
                <div
                  className={
                    expanderSymbol
                      ? 'text-green-500 text-sm p-1 select-none cursor-pointer'
                      : 'text-sm pl-1 select-none'
                  }
                  onKeyDown={() => onExpanderClick(task)}
                  onClick={() => onExpanderClick(task)}
                >
                  {expanderSymbol}
                </div>
                <div>{task.name}</div>
              </div>
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {DateTime.fromJSDate(task.start).toFormat('dd.MM.yyyy')}
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {DateTime.fromJSDate(task.end).toFormat('dd.MM.yyyy')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
