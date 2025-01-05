import React, {
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from '@src/components/ui/sheet'
import {
  PriorityType,
  TaskStatusType,
  type Tag,
  type Task,
  type User,
} from '@prisma/client'
import { Separator } from '../ui/separator'
import {
  CalendarClock,
  CheckSquare,
  ChevronsRight,
  ClockArrowDown,
  Folders,
  FolderSearch,
  Loader2,
  MessagesSquareIcon,
  PanelBottomClose,
  Pencil,
  Star,
  TagIcon,
  UserCheckIcon,
  UserIcon,
} from 'lucide-react'
import { Button } from '../ui/button'
import { DateTime } from 'luxon'
import UserAvatar from '../Avatar/UserAvatar'
import { Badge } from '../ui/badge'
import { capitalize, getColorByTaskStatusType } from '@src/lib/utils'
import useSWR, { type KeyedMutator } from 'swr'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import GeneralTableSelect from '../Select/GeneralTableSelect'
import { SelectItem } from '../ui/tableSelect'
import { updateResourceById } from '@src/lib/api/updateResource'
import RelatedWorkTab from '../Tabs/ViewTaskTabs/RelatedWorkTab'
import CommentTab from '../Tabs/ViewTaskTabs/CommentTab'
import { ProjectDataContext } from '../Contexts/ProjectDataContext'

interface ViewTaskSheet {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  taskId: string
  projectName: string
  mutate?: KeyedMutator<any>
}

const ViewTaskSheet = ({
  open,
  setOpen,
  taskId,
  projectName,
  mutate,
}: ViewTaskSheet) => {
  const { data: task } = useSWR<
    Task & {
      subtasks: Task[]
      tags: Tag[]
      assignedTo: User
      parent: Task
    }
  >(taskId ? `/api/db/task/${taskId}` : null)

  const projectUsers = useContext(ProjectDataContext)
  // Tab definitions
  const taskSheetTabs: {
    id: string
    component: JSX.Element
    headerComponent: JSX.Element
  }[] = [
    {
      id: 'related_work',
      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <Folders size={18} />
          Related Work
        </div>
      ),
      component: (
        <RelatedWorkTab parent={task?.parent} subtasks={task?.subtasks} />
      ),
    },
    {
      id: 'comments',

      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <MessagesSquareIcon size={18} />
          Comments
        </div>
      ),
      component: <CommentTab />,
    },
  ]
  const [tab, setTab] = useState('related_work')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        hideSheetClose
        className="p-0 w-[800px] overflow-y-scroll dark:bg-neutral-900"
      >
        {!task ? (
          <div className="w-full flex justify-center items-center min-h-[650px]">
            <Loader2 className="h-6 w-6 animate-spin ml-2 dark:text-white m-1" />
          </div>
        ) : (
          <>
            <header className="flex justify-between h-[50px] sticky w-full top-0 bg-hover dark:bg-neutral-950 p-2">
              <div className="flex gap-2 items-center mt-1.5 ">
                <SheetClose asChild>
                  <Button variant={'ghost'} className="p-1 h-fit">
                    <ChevronsRight className="text-text-secondary" size={18} />
                  </Button>
                </SheetClose>
                <Button variant={'ghost'} className="p-1 h-fit" asChild>
                  <Link href={`/app/${projectName}/edit/${task.id}`}>
                    <Pencil className="text-text-secondary" size={15} />
                  </Link>
                </Button>
                <Button variant={'ghost'} className="p-1 h-fit">
                  <Star className="text-text-secondary" size={15} />
                </Button>
              </div>
              {task.status !== 'DONE' && (
                <div className="flex gap-2 items-center mt-1.5">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      if (task.status !== 'DONE') {
                        updateResourceById(
                          'task',
                          task.id,
                          { status: 'DONE' },
                          { mutate },
                        )
                      }
                    }}
                    className="text-xs p-1 h-fit text-text-secondary flex gap-2 items-center"
                  >
                    <CheckSquare size={15} />
                    Mark as Complete
                  </Button>
                </div>
              )}
            </header>
            <Separator />

            <div className="p-3 text-left">
              <SheetTitle>{task?.title}</SheetTitle>
              <div className="grid gap-y-4 text-xs pt-6 ">
                {/* Entry 1 */}
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex gap-2 items-center">
                    <UserCheckIcon
                      className="dark:text-neutral-400"
                      size={15}
                    />
                    <span>Assigned To</span>
                  </div>
                  <GeneralTableSelect
                    key={'assignedTo-select'}
                    id={task.id}
                    mutate={mutate}
                    apiRoute="task"
                    paramToUpdate="assignedToId"
                    clearable
                    stylingProps={{
                      triggerStyle: 'w-fit h-fit p-1',
                    }}
                    initialValue={
                      task?.assignedTo ? (
                        <div className="flex items-center gap-1">
                          <UserAvatar
                            username={task.assignedTo.name}
                            avatarSize={25}
                            fontSize={10}
                          />
                          {task.assignedTo.name}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 ml-1">
                          <UserIcon className="w-[18px]" />
                          <span>Unassigned</span>
                        </div>
                      )
                    }
                  >
                    {projectUsers
                      ? projectUsers.users?.map((user) => (
                          <SelectItem
                            value={user.id}
                            key={`user-item-${user.id}`}
                          >
                            <div className="flex items-center gap-1">
                              <UserAvatar
                                avatarSize={25}
                                fontSize={10}
                                username={user.name}
                              />
                              {user.name}
                            </div>
                          </SelectItem>
                        ))
                      : null}
                  </GeneralTableSelect>
                </div>

                {/* Entry 2 */}
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex gap-2 items-center">
                    <CalendarClock
                      className="dark:text-neutral-400"
                      size={15}
                    />
                    <span>Estimation</span>
                  </div>

                  <span>
                    {`${DateTime.fromISO(
                      new Date(task?.startDate ?? new Date()).toISOString(),
                    ).toFormat('MMM dd, yyyy')} - ${DateTime.fromISO(
                      new Date(task?.dueDate ?? new Date()).toISOString(),
                    ).toFormat('MMM dd, yyyy')}`}
                  </span>
                </div>

                {/* Entry 3 */}
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="flex gap-2 items-center">
                    <PanelBottomClose
                      className="dark:text-neutral-400"
                      size={15}
                    />
                    <span>Status</span>
                  </div>

                  <GeneralTableSelect
                    key={`status-${task.id}`}
                    id={task.id}
                    initialValue={
                      <div className="flex gap-2 items-center">
                        <div
                          className={`rounded-full h-2 w-2 ${getColorByTaskStatusType(
                            task.status,
                          )}`}
                        />
                        {capitalize(task?.status ?? '')}
                      </div>
                    }
                    apiRoute="task"
                    paramToUpdate="status"
                    mutate={mutate}
                    stylingProps={{ triggerStyle: 'w-fit h-fit p-1' }}
                  >
                    {Object.keys(TaskStatusType).map((status) => (
                      <SelectItem key={`status-item-${status}`} value={status}>
                        <div className="flex gap-2 items-center">
                          <div
                            className={`rounded-full h-2 w-2 ${getColorByTaskStatusType(
                              status,
                            )}`}
                          />
                          {capitalize(status)}
                        </div>
                      </SelectItem>
                    ))}
                  </GeneralTableSelect>
                </div>

                {/* Entry 4 */}
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="flex gap-2 items-center">
                    <ClockArrowDown
                      className="dark:text-neutral-400"
                      size={15}
                    />
                    <span>Priority</span>
                  </div>
                  <GeneralTableSelect
                    key={`priority-${task.id}`}
                    id={task.id}
                    mutate={mutate}
                    initialValue={capitalize(task?.priority ?? '')}
                    apiRoute="task"
                    paramToUpdate="priority"
                    stylingProps={{ triggerStyle: 'w-fit h-fit p-1' }}
                  >
                    {Object.keys(PriorityType).map((priority) => (
                      <SelectItem
                        key={`priority-item-${priority}`}
                        value={priority}
                      >
                        {capitalize(priority)}
                      </SelectItem>
                    ))}
                  </GeneralTableSelect>
                </div>
                {/* Entry 6 */}
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex gap-2 items-center">
                    <TagIcon className="dark:text-neutral-400" size={15} />
                    <span>Tags</span>
                  </div>
                  <span>
                    {task?.tags?.map((tag) => (
                      <Badge variant={'outline'}>{tag.title}</Badge>
                    ))}
                  </span>
                </div>
              </div>

              <div className="w-full p-3 rounded-md bg-hover text-xs flex flex-col gap-y-1 mt-4">
                <span className="font-semibold">Task Description</span>

                <span className="text-text-secondary">
                  {task?.description === ''
                    ? 'No Description given.'
                    : task?.description}
                </span>
              </div>
            </div>
            <Separator />
            <SheetFooter className=" h-full justify-start p-3">
              <Tabs value={tab} onValueChange={setTab} className="w-full pb-10">
                <TabsList className="inline-flex items-center justify-start border overflow-x-auto whitespace-nowrap sm:justify-center sm:gap-2">
                  {taskSheetTabs.map((tabHeader) => (
                    <TabsTrigger
                      style={{ fontSize: 12 }}
                      value={tabHeader.id}
                      key={tabHeader.id}
                    >
                      {tabHeader.headerComponent}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {taskSheetTabs.map((tab) => (
                  <TabsContent value={tab.id} key={`${tab.id}-tab`}>
                    {tab.component}
                  </TabsContent>
                ))}
              </Tabs>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default ViewTaskSheet
