import { PublishCommand } from '@aws-sdk/client-sns'
import type { SNSParamsInput } from '@server/domain/snsSchema'
import { getSNSClient } from '@server/utils/snsClient'

export const SNSService = {
  sendMessageToSNS: async (stringifiedBody: string, topicArn: string) => {
    const SNSClient = getSNSClient()

    const SNSinput: SNSParamsInput = {
      Message: stringifiedBody,
      TopicArn: topicArn,
      MessageStructure: 'json',
    }

    const command = new PublishCommand(SNSinput)
    const response = await SNSClient.send(command)

    return response
  },
}
