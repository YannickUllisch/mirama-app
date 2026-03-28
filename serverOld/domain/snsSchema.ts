import z from 'zod'

export const SNSParamsSchema = z.object({
  Message: z.string(),
  TopicArn: z.string().min(1, 'Topic has to be defined'),
  TargetArn: z.string().optional(),
  Subject: z.string().optional(),
  MessageStructure: z.string().optional(),
})

// TypeScript types inferred from schemas
export type SNSParamsInput = z.infer<typeof SNSParamsSchema>
