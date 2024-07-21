'use client'
import {
  GanttComponent,
  Inject,
  Edit,
  Filter,
  Sort,
  type TaskFieldsModel,
} from '@syncfusion/ej2-react-gantt'
import { projectResources, data } from './data'
import { registerLicense } from '@syncfusion/ej2-base'
import '@syncfusion/ej2-base/styles/material-dark.css'
import '@syncfusion/ej2-buttons/styles/material-dark.css'
import '@syncfusion/ej2-calendars/styles/material-dark.css'
import '@syncfusion/ej2-dropdowns/styles/material-dark.css'
import '@syncfusion/ej2-inputs/styles/material-dark.css'
import '@syncfusion/ej2-navigations/styles/material-dark.css'
import '@syncfusion/ej2-lists/styles/material-dark.css'
import '@syncfusion/ej2-layouts/styles/material-dark.css'
import '@syncfusion/ej2-popups/styles/material-dark.css'
import '@syncfusion/ej2-splitbuttons/styles/material-dark.css'
import '@syncfusion/ej2-grids/styles/material-dark.css'
import '@syncfusion/ej2-richtexteditor/styles/material-dark.css'
import '@syncfusion/ej2-treegrid/styles/material-dark.css'
import '@syncfusion/ej2-react-gantt/styles/fluent-dark.css'
import type { Task, User } from '@prisma/client'
import type { FC } from 'react'

// Registering Syncfusion license key
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXpfdnVURmddUEJzXkc=',
)

const taskValues: TaskFieldsModel = {
  id: 'TaskID',
  name: 'TaskName',
  startDate: 'StartDate',
  endDate: 'EndDate',
  duration: 'Duration',
  progress: 'Progress',
  child: 'subtasks',
  dependency: 'Predecessor',
}

interface GanttChartProps {
  tasks: Task[]
}

const GanttChart: FC<GanttChartProps> = ({ tasks }) => {
  return (
    <>
      <GanttComponent
        dataSource={data}
        allowFiltering={true}
        allowSorting={true}
        taskFields={taskValues}
        resources={projectResources}
        height="400px"
        width="1100px"
      >
        <Inject services={[Edit, Filter, Sort]} />
      </GanttComponent>
    </>
  )
}

export default GanttChart
