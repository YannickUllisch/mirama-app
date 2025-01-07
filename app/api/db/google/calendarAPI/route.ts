import { auth } from '@auth'
import db from '@db'
import { Role } from '@prisma/client'
import { validateRequest } from '@src/lib/validateRequest'
import { google } from 'googleapis'

export const POST = async (_req: Request) => {
  try {
    // Checking Permissions
    const session = await auth()
    const validatedRequest = await validateRequest(session, [
      Role.OWNER,
      Role.ADMIN,
      Role.USER,
      Role.FREELANCE,
    ])
    if (validatedRequest) {
      return validatedRequest
    }
    if (session?.user.provider !== 'google') {
      return Response.json(
        {
          ok: false,
          message: 'Currently only possible when connected to a Google account',
        },
        { status: 500 },
      )
    }
    // NOTE: I have not figured out yet how the API can work without being logged in through google
    if (session?.user.provider === 'google') {
      const account = await db.account.findFirst({
        where: {
          userId: session?.user.id,
          provider: 'google',
        },
      })
      if (!account || !account.access_token) {
        return Response.json(
          { ok: false, message: 'Linked account not found!' },
          { status: 500 },
        )
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID ?? '',
        process.env.GOOGLE_CLIENT_SECRET ?? '',
      )
      // Set the access token for the request
      oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account?.refresh_token,
      })
      // Use Google Calendar API to add the event
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      try {
        const result = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: 'Test Event', // Title of the event
            description: 'This is a test event', // Optional description
            start: {
              dateTime: '2024-11-20T10:00:00-05:00', // Start time (ISO 8601 format)
              timeZone: 'America/New_York', // Time zone
            },
            end: {
              dateTime: '2024-11-20T11:00:00-05:00', // End time (ISO 8601 format)
              timeZone: 'America/New_York', // Time zone
            },
            reminders: {
              useDefault: false, // Custom reminders
              overrides: [
                { method: 'email', minutes: 24 * 60 }, // Email reminder 24 hours before
                { method: 'popup', minutes: 10 }, // Popup reminder 10 minutes before
              ],
            },
          },
        })
        return Response.json(
          {
            success: true,
            message: 'Event added to Calendar',
            data: result.data,
          },
          { status: 200 },
        )
      } catch (err) {
        console.error(err)
      }
    }
    return Response.json(
      { success: false, message: 'Need to be logged in with google provider' },
      { status: 401 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
