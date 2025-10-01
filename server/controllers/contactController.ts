import { ContactRequestSchema } from '@server/domain/contactSchema'
import { SNSService } from '@server/services/snsService'
import type { NextRequest } from 'next/server'

const contactRequestController = async (req: NextRequest) => {
  const body = await req.json()
  const input = ContactRequestSchema.parse(body)

  await SNSService.sendMessageToSNS(
    JSON.stringify(input),
    process.env.NOTIFICATION_TOPIC_ARN ?? '',
  )

  return Response.json(
    { success: true, message: 'Contact Request Sent' },
    { status: 200 },
  )
}

export const ContactController = {
  contactRequestController,
}
