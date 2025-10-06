import { Role } from '@prisma/client'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import TableTab from '@src/components/Tabs/ProjectTabs/TableTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/TimelineTab'
import {
  ClipboardList,
  GanttChart,
  ListTodo,
  MapIcon,
  Table2,
} from 'lucide-react'
import type { JSX } from 'react'

// Tab definitions
export const projectTabs: {
  roles: Role[]
  id: string
  component: JSX.Element
  headerComponent: JSX.Element
}[] = [
  {
    id: 'overview',
    roles: Object.values(Role),
    component: <OverviewTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <MapIcon width={15} /> Overview
      </div>
    ),
  },
  {
    id: 'table',
    roles: Object.values(Role),
    component: <TableTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <Table2 width={15} /> Table
      </div>
    ),
  },
  {
    id: 'list',
    roles: Object.values(Role),
    component: <ListTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <ListTodo width={15} /> List
      </div>
    ),
  },
  {
    id: 'kanban',
    roles: Object.values(Role),
    component: <BoardTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <ClipboardList width={15} /> Board
      </div>
    ),
  },
  {
    id: 'timeline',
    roles: Object.values(Role),
    component: <GanttTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <GanttChart width={15} /> Timeline
      </div>
    ),
  },
]
