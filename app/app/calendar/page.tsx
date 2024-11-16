'use client'
import type { Project } from '@prisma/client'
import ShadcnBigCalendar from '@src/components/Calendar/shadcn-big-calendar'
import moment from 'moment'
import { type SetStateAction, useMemo, useState } from 'react'
import { momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import useSWR from 'swr'

const DnDCalendar = ShadcnBigCalendar
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id?: number | string
  title: string
  start: Date | string
  end: Date | string
  allDay?: boolean
  resource?: any
  [key: string]: any
}

const CalendarClientPage = () => {
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())

  const { data: projects } = useSWR<Project[]>('/api/db/project?archived=false')

  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const handleViewChange = (newView: SetStateAction<any>) => {
    setView(newView)
  }

  const events: CalendarEvent[] = useMemo(() => {
    return (
      projects?.map((proj) => ({
        id: proj.id,
        title: `Project: ${proj.name}`,
        start: new Date(proj.startDate),
        end: new Date(proj.endDate),
        allDay: true,
      })) ?? []
    )
  }, [projects])

  // const handleEventResize = (data: any) => {
  //   const { start, end, event } = data
  //   updateResourceById(
  //     'project',
  //     event.id,
  //     {
  //       startDate: start,
  //       endDate: end,
  //     },
  //     { mutate: updateProjects },
  //   )
  // }

  // const handleEventDrop = (data: any) => {
  //   const { start, end, event } = data
  //   updateResourceById(
  //     'project',
  //     event.id,
  //     {
  //       startDate: start,
  //       endDate: end,
  //     },
  //     { mutate: updateProjects },
  //   )
  // }

  return (
    <DnDCalendar
      localizer={localizer}
      style={{ height: 600, width: '100%' }}
      events={events}
      date={date}
      onNavigate={handleNavigate}
      view={view}
      onView={handleViewChange}
      views={{ month: true, work_week: true, agenda: true }}
    />
  )
}

export default CalendarClientPage
