import type { Session } from 'next-auth'
import type { GoogleCalendarEvent } from '../../types/types'
import { postResource } from './postResource'

export const AddGoogleCalendarEvent = ({
  session,
  event,
}: { session: Session | null; event: GoogleCalendarEvent }) => {
  postResource('/google/calendarAPI', event)
}
