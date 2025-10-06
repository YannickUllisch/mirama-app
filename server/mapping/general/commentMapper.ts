import type { User } from '@/prisma/zod'
import type { Comment } from '@prisma/client'
import type { CommentResponseType } from '@server/domain/commentSchema'
import { UserMapper } from '../user/userMapping'

const mapDefaultToApi = (
  input: Comment & { user: User },
): CommentResponseType => {
  return {
    ...input,
    user: UserMapper.mapDefaultToApi(input.user),
  }
}

export const CommentMapper = {
  mapDefaultToApi,
}
