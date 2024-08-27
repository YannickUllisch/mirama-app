import React from 'react'
import { ViewSwitcher } from './ViewSwitcher'
import { Checkbox } from '../ui/checkbox'
import { ViewMode } from './types/public-types'
import { Gantt } from './components/gantt/gantt'

export type TaskType = 'task' | 'milestone' | 'project'

interface TestTask {
  id: string
  type: TaskType
  name: string
  start: Date
  end: Date
  progress: number
  styles?: {
    backgroundColor?: string
    backgroundSelectedColor?: string
    progressColor?: string
    progressSelectedColor?: string
  }
  isDisabled?: boolean
  project?: string
  dependencies?: string[]
  hideChildren?: boolean
  displayOrder?: number
}

export function initTasks() {
  const currentDate = new Date()
  const tasks: TestTask[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: 'Microsoft',
      id: 'ProjectSample',
      progress: 25,
      type: 'project',
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28,
      ),
      name: 'Idea',
      id: 'Task 0',
      progress: 45,
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: 'Research',
      id: 'Task 1',
      progress: 25,
      dependencies: ['Task 0'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: 'Discussion with team',
      id: 'Task 2',
      progress: 10,
      dependencies: ['Task 1'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: 'Developing',
      id: 'Task 3',
      progress: 2,
      dependencies: ['Task 2'],
      type: 'task',
      project: 'ProjectSample',
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: 'Review',
      id: 'Task 4',
      type: 'task',
      progress: 70,
      dependencies: ['Task 2'],
      project: 'ProjectSample',
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: 'Release',
      id: 'Task 6',
      progress: currentDate.getMonth(),
      type: 'milestone',
      dependencies: ['Task 4'],
      project: 'ProjectSample',
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: 'Party Time',
      id: 'Task 9',
      progress: 0,
      isDisabled: true,
      type: 'task',
    },
  ]
  return tasks
}

const GanttChart = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day)
  const [tasks, setTasks] = React.useState<TestTask[]>(initTasks())
  const [isChecked, setIsChecked] = React.useState(true)
  let columnWidth = 65
  if (view === ViewMode.Year) {
    columnWidth = 350
  } else if (view === ViewMode.Month) {
    columnWidth = 300
  } else if (view === ViewMode.Week) {
    columnWidth = 250
  }

  const handleTaskDelete = (task: TestTask) => {
    const conf = window.confirm(`Are you sure about ${task.name} ?`)
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id))
    }
    return conf
  }

  const handleProgressChange = async (task: TestTask) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
  }

  const handleExpanderClick = (task: TestTask) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
  }

  return (
    <div className="flex flex-col items-center">
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <div className="w-[100%] max-w-[1100px] overflow-x-auto overflow-y-hidden m-auto">
        <div className="flex items-center gap-1">
          <Checkbox
            defaultChecked={isChecked}
            onClick={() => setIsChecked(!isChecked)}
          />
          <span className="Slider" />
          Show Task List
        </div>
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDelete={handleTaskDelete}
          onProgressChange={handleProgressChange}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? '150px' : ''}
          columnWidth={columnWidth}
        />
      </div>
    </div>
  )
}

export default GanttChart
