'use client'
import apiRequest from '@hooks/query'
import FullCalender from '@src/components/Calendar/full-calender'
import { calendarConfig } from '@src/components/Calendar/full-calender-config'
import PageHeader from '@src/components/PageHeader'
import { CalendarIcon } from 'lucide-react'

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
    <>
      <PageHeader
        icon={CalendarIcon}
        title="Calendar"
        description={'Calendar View of your project and task timeline'}
      />
      <FullCalender events={[]} config={calendarConfig} />
    </>
  )
}

export default CalendarClientPage
