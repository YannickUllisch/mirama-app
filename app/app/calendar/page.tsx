'use client'
import apiRequest from '@hooks/query'
import FullCalender from '@src/components/Calendar/full-calender'
import { calendarConfig } from '@src/components/Calendar/full-calender-config'

const CalendarClientPage = () => {
  const { data: _projects } = apiRequest.project.fetchAll.useQuery()

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
      <FullCalender events={[]} config={calendarConfig} />
    </section>
  )
}

export default CalendarClientPage
