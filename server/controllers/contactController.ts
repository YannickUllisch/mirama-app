import { ContactRequestSchema } from '@server/domain/contactSchema'
import { sendMessageToSNS } from '@server/services/snsService'
import type { NextRequest } from 'next/server'

export const contactRequestController = async (req: NextRequest) => {
  const body = await req.json()
  const input = ContactRequestSchema.parse(body)

  await sendMessageToSNS(
    JSON.stringify(input),
    process.env.NOTIFICATION_TOPIC_ARN ?? '',
  )

  return Response.json(
    { ok: true, message: 'Contact Request Sent' },
    { status: 200 },
  )
}
