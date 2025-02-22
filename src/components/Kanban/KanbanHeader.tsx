import { Search } from 'lucide-react'
import { Input } from '@src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/components/ui/select'
import { Button } from '@src/components/ui/button'

export interface KanbanHeaderProps {
  onSearch?: (value: string) => void
  onFilterStatus?: (status: string) => void
  onFilterPriority?: (priority: string) => void
  onFilterAssignee?: (assigneeId: string) => void
  users?: Array<{ id: string; name: string }>
}

export function KanbanHeader({
  onSearch,
  onFilterStatus,
  onFilterPriority,
  onFilterAssignee,
  users = [],
}: KanbanHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-inherit">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div />
          <Button>Create Task</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          <Select onValueChange={onFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onFilterAssignee}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Assignees</SelectItem>
              <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
