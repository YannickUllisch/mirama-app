import { auth } from '@auth'
import { PublishCommand } from '@aws-sdk/client-sns'
import { Role } from '@prisma/client'
import { getSNSClient } from '@src/lib/sns'
import { validateRequest } from '@src/lib/validateRequest'
import type { SNSParams } from '@src/types/SNS'

export const GET = auth(async (req) => {
  try {
    // Checking Permissions
    const session = req.auth
    const validatedRequest = await validateRequest(session, [
      Role.ADMIN,
      Role.OWNER,
    ])
    if (validatedRequest) {
      return validatedRequest
    }

    try {
      const SNSClient = getSNSClient()

      const SNSinput: SNSParams = {
        Message: JSON.stringify({ default: 'hey' }),
        TopicArn: process.env.NOTIFICATION_TOPIC_ARN ?? '',
        MessageStructure: 'json',
      }

      const command = new PublishCommand(SNSinput)
      const response = await SNSClient.send(command)

      console.dir(response)
    } catch (err) {
      console.error(err)
    }

    return Response.json('OK', { status: 200 })
  } catch (err) {
    return Response.json(
      { ok: false, message: `Failed with Error ${err}` },
      { status: 500 },
    )
  }
})
