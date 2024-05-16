'use client'
import { extend, addClass } from '@syncfusion/ej2-base'
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
  type DialogFieldsModel,
  type CardRenderedEventArgs,
} from '@syncfusion/ej2-react-kanban'
import * as dataSource from './data.json'
import { Card, CardContent } from '../ui/card'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import { fetcher } from '@/src/lib/utils'
import TaskDialog from '../Dialogs/TaskDialog'

interface TabProps {
  projectId: string
}

interface TaskCardProps {
  Title: string
  Status: string
  Summary: string
  Type: string
  Priority: string
  Estimate: number
  Assignee: string
}

const Overview: FC<TabProps> = ({ projectId }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  const cardTemplate = (props: TaskCardProps) => {
    return (
      <Card>
        <CardContent>{props.Type}</CardContent>{' '}
      </Card>
    )
  }
  const columnTemplate = (props: { [key: string]: string }) => {
    return (
      <div className="">
        <div className={`${props.keyField}`} />
        <div className="header-text">{props.headerText}</div>
      </div>
    )
  }

  function convertTasksToJSON(
    tasks: (Task & {
      assignedTo: User
    })[],
  ): Record<string, any>[] {
    return tasks.map((task) => {
      const status = 'Open'
      const type = 'Improvement'
      const priority = 'Low' // Assuming default priority is low
      const estimate = 3.5 // Assuming default estimate is 3.5 (you can adjust this)
      const assignee = task.assignedToId || 'Unassigned' // Assuming default assignee is "Unassigned"

      return {
        ID: task.id,
        Title: task.taskName,
        Status: status,
        Summary: task.description
          ? task.description
          : 'No description available',
        Color: '#673AB8',
        Type: type,
        Priority: priority,
        Estimate: estimate,
        Assignee: assignee,
      }
    })
  }

  const customStyles = `
  .custom-card {
    background-color: #f0f0f0; /* Set your desired background color */
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 5px;
  }
  .custom-card-header {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .custom-card-content {
    font-size: 14px;
  }
`

  // Apply custom styles
  const style = document.createElement('style')
  style.textContent = customStyles
  document.head.appendChild(style)

  return (
    <div>
      {tasks ? (
        <KanbanComponent
          keyField="Status"
          dataSource={convertTasksToJSON(tasks)}
          enableTooltip={true}
          swimlaneSettings={{ keyField: 'Assignee' }}
          cardSettings={{
            headerField: 'Title',
            template: cardTemplate.bind(this),
            selectionType: 'Multiple',
          }}
        >
          <ColumnsDirective>
            <ColumnDirective
              headerText="To Do"
              keyField="Open"
              allowToggle={true}
              template={columnTemplate.bind(this)}
            />
            <ColumnDirective
              headerText="In Progress"
              keyField="InProgress"
              allowToggle={true}
              template={columnTemplate.bind(this)}
            />
            <ColumnDirective
              headerText="In Review"
              keyField="Review"
              allowToggle={true}
              template={columnTemplate.bind(this)}
            />
            <ColumnDirective
              headerText="Done"
              keyField="Close"
              allowToggle={true}
              template={columnTemplate.bind(this)}
            />
          </ColumnsDirective>
        </KanbanComponent>
      ) : null}
    </div>
  )
}
export default Overview
