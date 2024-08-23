import type React from 'react'
import { useMemo } from 'react'
import type { Task } from '../../types/public-types'

const localeDateStringCache: { [key: string]: string } = {}

const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString()
    let lds = localeDateStringCache[key]
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions)
      localeDateStringCache[key] = lds
    }
    return lds
  }

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

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
  locale,
  onExpanderClick,
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale],
  )

  return (
    <div
      className="table border-b-2 border-l-2"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t) => {
        let expanderSymbol = ''
        if (t.hideChildren === false) {
          expanderSymbol = '▼'
        } else if (t.hideChildren === true) {
          expanderSymbol = '▶'
        }

        return (
          <div
            className="table-row text-ellipsis shadow-sm"
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className="flex">
                <div
                  className={
                    expanderSymbol
                      ? 'text-green-500 text-sm p-1 select-none cursor-pointer'
                      : 'text-sm pl-1 select-none'
                  }
                  onKeyDown={() => onExpanderClick(t)}
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{t.name}</div>
              </div>
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div>
            <div
              className="table-cell align-middle whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
