import { sendContactEmail } from '@src/email/mailer'
import type { ContactSchema } from '@src/lib/schemas'
import type { NextRequest } from 'next/server'
import type { z } from 'zod'

export const POST = async (req: NextRequest) => {
  try {
    const contact = (await req.json()) as z.infer<typeof ContactSchema>

    try {
      await sendContactEmail({ ...contact })
    } catch (err) {
      return Response.json(
        { ok: false, message: `Failed with Error ${err}` },
        { status: 500 },
      )
    }

    return Response.json(
      { ok: true, message: 'Message has been Sent!' },
      { status: 200 },
    )
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
}
