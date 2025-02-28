import { Role } from '@prisma/client'
import BoardTab from '@src/components/Tabs/ProjectTabs/BoardTab'
import GanttTab from '@src/components/Tabs/ProjectTabs/TimelineTab'
import ListTab from '@src/components/Tabs/ProjectTabs/ListTab'
import OverviewTab from '@src/components/Tabs/ProjectTabs/OverviewTab'
import SettingsTab from '@src/components/Tabs/ProjectTabs/SettingsTab'
import {
  MapIcon,
  Table2,
  ClipboardList,
  GanttChart,
  Settings,
} from 'lucide-react'

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
    component: <ListTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <Table2 width={15} /> Table
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
  {
    id: 'settings',
    roles: Object.values(Role),
    component: <SettingsTab />,
    headerComponent: (
      <div className="flex justify-center gap-1 items-center">
        <Settings width={15} /> Settings
      </div>
    ),
  },
]
