import type { Session } from 'next-auth'
import { signIn } from 'next-auth/react'
import type { GoogleCalendarEvent } from '../../types/types'
import { postResource } from './postResource'

export const AddGoogleCalendarEvent = async ({
  session,
  event,
}: { session: Session | null; event: GoogleCalendarEvent }) => {
  if (session?.user.provider !== 'google') {
    await signIn('google', { redirect: false })
  }
  postResource('/google/calendarAPI', event)
}
