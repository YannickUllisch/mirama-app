'use client'
import type { Project } from '@prisma/client'
import { newevents } from '@src/components/Calendar/shadcn-fullcalender-main/data/events'
import { calendarConfig } from '@src/components/Calendar/full-calender-config'
import FullCalender from '@src/components/Calendar/full-calender'

import useSWR from 'swr'

const CalendarClientPage = () => {
  const { data: projects } = useSWR<Project[]>('/api/db/project?archived=false')

  // const events: CalendarEvent[] = useMemo(() => {
  //   return (
  //     projects?.map((proj) => ({
  //       id: proj.id,
  //       title: `Project: ${proj.name}`,
  //       start: new Date(proj.startDate),
  //       end: new Date(proj.endDate),
  //       allDay: true,
  //     })) ?? []
  //   )
  // }, [projects])
  return (
    <section className="py-10">
      <FullCalender events={newevents} config={calendarConfig} />
    </section>
  )
}

export default CalendarClientPage
