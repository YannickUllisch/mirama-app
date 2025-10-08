'use server'

export const inviteUserCognito = ({
  email,
}: {
  email: string
}) => {
  // TODO: Send own Invitation Link with AWS SES. Add it to SQS as event to be handled.
  console.info(email)
}
