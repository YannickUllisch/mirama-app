import React, { useState, type Dispatch, type SetStateAction } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@src/components/ui/sheet'
import type { Tag, Task, TaskCategory, User } from '@prisma/client'
import { Separator } from '../ui/separator'
import {
  CalendarClock,
  CheckSquare,
  ClockArrowDown,
  Folders,
  FolderSearch,
  Loader2,
  Maximize2,
  MessagesSquareIcon,
  PanelBottomClose,
  Pencil,
  Star,
  TagIcon,
  UserCheckIcon,
} from 'lucide-react'
import { Button } from '../ui/button'
import { DateTime } from 'luxon'
import UserAvatar from '../Avatar/UserAvatar'
import { Badge } from '../ui/badge'
import { capitalize, getColorByTaskStatusType } from '@src/lib/utils'
import useSWR from 'swr'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface ViewTaskSheet {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  taskId: string
  projectName: string
}

const ViewTaskSheet = ({
  open,
  setOpen,
  taskId,
  projectName,
}: ViewTaskSheet) => {
  const { data: task } = useSWR<
    Task & {
      subtasks: Task[]
      tags: Tag[]
      assignedTo: User
      category: TaskCategory
    }
  >(`/api/db/task/${taskId}`)

  // Tab definitions
  const projectTabs: {
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
      component: <span>Related Work</span>,
    },
    {
      id: 'comments',

      headerComponent: (
        <div className="flex justify-center gap-1 items-center">
          <MessagesSquareIcon size={18} />
          Comments
        </div>
      ),
      component: <span>comments</span>,
    },
  ]
  const [tab, setTab] = useState('related_work')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="p-0 w-[800px]">
        {!task ? (
          <div className="w-full flex justify-center items-center min-h-[650px]">
            <Loader2 className="h-6 w-6 animate-spin ml-2 dark:text-white m-1" />
          </div>
        ) : (
          <>
            {' '}
            <SheetHeader>
              <header className="h-[40px] flex items-center p-2 mt-2 gap-2">
                <Button variant={'ghost'} className="p-1 h-fit" asChild>
                  <Link href={`/app/${projectName}/edit/${task.id}`}>
                    <Pencil className="text-text-secondary" size={15} />
                  </Link>
                </Button>
                <Button variant={'ghost'} className="p-1 h-fit">
                  <Star className="text-text-secondary" size={15} />
                </Button>
                <Button
                  variant={'outline'}
                  className="text-xs p-1 h-fit text-text-secondary flex gap-2 items-center"
                >
                  <CheckSquare size={15} />
                  Mark as Complete
                </Button>
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
                    <div className="flex gap-2 items-center">
                      <UserAvatar
                        avatarSize={20}
                        username={task?.assignedTo?.name ?? ''}
                        fontSize={8}
                      />
                      <span>{task?.assignedTo?.name}</span>
                    </div>
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
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="flex gap-2 items-center">
                      <PanelBottomClose
                        className="dark:text-neutral-400"
                        size={15}
                      />
                      <span>Status</span>
                    </div>

                    <Badge
                      className={`w-fit flex gap-2 ${getColorByTaskStatusType(
                        task?.status ?? '',
                      )}`}
                    >
                      <div className="h-1 w-1 rounded-full bg-white" />
                      {capitalize(task?.status ?? '')}
                    </Badge>
                  </div>

                  {/* Entry 4 */}
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="flex gap-2 items-center">
                      <ClockArrowDown
                        className="dark:text-neutral-400"
                        size={15}
                      />
                      <span>Priority</span>
                    </div>
                    <span>{task?.priority}</span>
                  </div>

                  {/* Entry 5 */}
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="flex gap-2 items-center">
                      <FolderSearch
                        className="dark:text-neutral-400"
                        size={15}
                      />
                      <span>Category</span>
                    </div>
                    <Badge
                      variant={'outline'}
                      className="w-fit"
                      style={{ backgroundColor: task?.category?.color }}
                    >
                      {task?.category?.title ?? ''}
                    </Badge>
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
            </SheetHeader>
            <Separator />
            <SheetFooter className=" h-full justify-start p-3">
              <Tabs value={tab} onValueChange={setTab} className="w-full pb-10">
                <TabsList className="inline-flex items-center justify-start border overflow-x-auto whitespace-nowrap sm:justify-center sm:gap-2">
                  {projectTabs.map((tabHeader) => (
                    <TabsTrigger
                      style={{ fontSize: 12 }}
                      value={tabHeader.id}
                      key={tabHeader.id}
                    >
                      {tabHeader.headerComponent}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {projectTabs.map((tab) => (
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
