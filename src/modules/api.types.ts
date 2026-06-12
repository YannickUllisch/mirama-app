import z from 'zod'

export const PaginatedResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pageNumber: z.number().int(),
    totalPages: z.number().int(),
    totalCount: z.number().int(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
  })

export type PaginatedResponse<T> = {
  items: T[]
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type PaginationParams = {
  pageNumber: number
  pageSize: number
}
