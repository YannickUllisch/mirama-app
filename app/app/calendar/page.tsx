'use client'
import ShadcnBigCalendar from '@src/components/Calendar/shadcn-big-calendar'
import moment from 'moment'
import { type SetStateAction, useState } from 'react'
import { momentLocalizer, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

const DnDCalendar = withDragAndDrop(ShadcnBigCalendar)
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id?: number | string
  title: string
  start: Date | string
  end: Date | string
  allDay?: boolean
  resource?: any
  [key: string]: any // Allows adding custom properties
}

const CalendarPage = () => {
  const [view, setView] = useState(Views.WEEK)
  const [date, setDate] = useState(new Date())

  const handleNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const handleViewChange = (newView: SetStateAction<any>) => {
    setView(newView)
  }

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Test',
      start: new Date(),
      end: moment().add(1, 'hour').toDate(),
      allDay: false,
    },
  ])

  // Step 2: Handle new event creation
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt('New Event Name')
    if (title) {
      const newEvent = {
        id: events.length + 1, // Unique ID for each event
        title,
        start,
        end,
        allDay: false,
      }
      setEvents((prevEvents) => [...prevEvents, newEvent])
    }
  }

  // Step 3: Handle event updates if using drag-and-drop (optional)
  const handleEventResize = (data: any) => {
    const { start, end, event } = data
    setEvents((prevEvents) =>
      prevEvents.map((existingEvent) =>
        existingEvent.id === event.id
          ? { ...existingEvent, start, end }
          : existingEvent,
      ),
    )
  }

  const handleEventDrop = (data: any) => {
    const { start, end, event } = data
    setEvents((prevEvents) =>
      prevEvents.map((existingEvent) =>
        existingEvent.id === event.id
          ? { ...existingEvent, start, end }
          : existingEvent,
      ),
    )
  }

  return (
    <div>
      <DnDCalendar
        localizer={localizer}
        style={{ height: 600, width: '100%' }}
        selectable
        events={events}
        onSelectSlot={handleSelectSlot}
        onEventResize={handleEventResize}
        onEventDrop={handleEventDrop}
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}
      />
    </div>
  )
}

export default CalendarPage
