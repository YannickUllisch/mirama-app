import { db } from '@db'

export const fetchCommentsByTaskId = async (id: string) => {
  const response = await db.comment.findMany({
    where: {
      taskId: id,
    },
    include: {
      user: true,
    },
  })

  return response
}
