'use client'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import {
  GanttComponent,
  Inject,
  Selection,
  ColumnsDirective,
  ColumnDirective,
} from '@syncfusion/ej2-react-gantt'
import { registerLicense } from '@syncfusion/ej2-base'

registerLicense(process.env.SYNCFUSION_LICENSE ?? '')

const Gantt = () => {
  const taskFields: any = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks',
  }
  const labelSettings: any = {
    leftLabel: 'TaskName',
  }
  const projectStartDate: Date = new Date('03/24/2019')
  const projectEndDate: Date = new Date('07/06/2019')

  return (
    <div className="control-pane">
      <div className="control-section">
        <GanttComponent
          id="Default"
          //dataSource={projectNewData}
          treeColumnIndex={1}
          taskFields={taskFields}
          labelSettings={labelSettings}
          height="410px"
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
        >
          <ColumnsDirective>
            <ColumnDirective field="TaskID" width="80" />
            <ColumnDirective
              field="TaskName"
              headerText="Job Name"
              width="250"
              clipMode="EllipsisWithTooltip"
            />
            <ColumnDirective field="StartDate" />
            <ColumnDirective field="Duration" />
            <ColumnDirective field="Progress" />
            <ColumnDirective field="Predecessor" />
          </ColumnsDirective>
          <Inject services={[Selection]} />
        </GanttComponent>
      </div>
    </div>
  )
}
export default Gantt
