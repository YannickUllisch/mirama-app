import type { ContactRequestInput } from '@server/domain/contactSchema'

export const handleContactRequest = (_input: ContactRequestInput) => {
  // TODO: Send contact request info into SNS->SQS setup and
  // handle in downstream Notification Service
  console.info(_input)
  return
}
