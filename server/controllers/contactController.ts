import { ContactRequestSchema } from '@server/domain/contactSchema'
import { handleContactRequest } from '@server/services/contactService'
import type { NextRequest } from 'next/server'

export const contactRequestController = async (req: NextRequest) => {
  const body = await req.json()
  const input = ContactRequestSchema.parse(body)

  await handleContactRequest(input)
  return Response.json(
    { ok: true, message: 'Contact Request Sent' },
    { status: 200 },
  )
}
