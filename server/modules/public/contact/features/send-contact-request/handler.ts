import { PublishCommand } from "@aws-sdk/client-sns"
import { AppContext } from "@server/shared/infrastructure/types"
import { getSNSClient } from "@server/shared/utils/snsClient"
import { SNSParamsInput } from "@server/shared/utils/snsSchema"
import { ContactRequestType } from "./schema"

export const SendContactRequestCommand =
  ({ logger, db }: AppContext) =>
  async (input: ContactRequestType) => {
 const SNSClient = getSNSClient()

    const client: SNSParamsInput = {
      Message: JSON.stringify(input),
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN ?? '',
      MessageStructure: 'json',
    }

    const command = new PublishCommand(client)
    await SNSClient.send(command)
  }
