import { createPublicRoute } from '@server/middleware/createPublicRoute'
import { SendContactRequestCommand } from '@server/modules/public/contact/features/send-contact-request/handler'
import { ContactRequestSchema } from '@server/modules/public/contact/features/send-contact-request/schema'

export const POST = createPublicRoute(
  {
    body: ContactRequestSchema,
  },
  async (_req, { ctx }, { body }) => {
    await SendContactRequestCommand(ctx)(body)
    return Response.json({ success: true }, { status: 201 })
  },
)
