import { ContactRequestSchema } from '@server/domain/contactSchema'
import { SNSService } from '@server/services/general/snsService'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

/**
 * Assumed route: /api/db/contact
 * @param req API request object as Next Request Type
 * @param session Validated Session from request
 * @param _logger Context Logger
 */
const sendContactRequest = async (req: NextRequest, logger: Logger) => {
  const body = await req.json()
  const input = ContactRequestSchema.parse(body)
  const contactLogger = logger.child({
    module: 'ContactController',
    op: 'sendContactRequest',
    url: req.nextUrl,
    method: req.method,
  })

  await SNSService.sendMessageToSNS(
    JSON.stringify(input),
    process.env.NOTIFICATION_TOPIC_ARN ?? '',
  )

  contactLogger.info('SNS Contact Message Sent')

  return Response.json(
    { success: true, message: 'Contact Request Sent' },
    { status: 200 },
  )
}

export const ContactController = {
  sendContactRequest,
}
