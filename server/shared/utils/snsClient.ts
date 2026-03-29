import { SNSClient } from '@aws-sdk/client-sns'

export const runtime = 'nodejs'

export const getSNSClient = () => {
  return new SNSClient({
    region: 'eu-west-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  })
}
