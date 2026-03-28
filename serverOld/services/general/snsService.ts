import type { SNSParamsInput } from '@/serverOld/domain/snsSchema'
import { getSNSClient } from '@/serverOld/utils/snsClient'
import { PublishCommand } from '@aws-sdk/client-sns'

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
