export interface SNSParams {
  Message: string
  TopicArn: string
  TargetArn?: string
  Subject?: string
  MessageStructure?: string
}
