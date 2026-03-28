import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

const COMMENT_INCLUDE = {
  member: true,
} as const

export const CommentRepository = (db: ScopedDb) => ({
  async findByTaskId(taskId: string) {
    return await db.comment.findMany({
      where: { taskId },
      include: COMMENT_INCLUDE,
    })
  },

  async findById(id: string) {
    return await db.comment.findFirst({
      where: { id },
      include: COMMENT_INCLUDE,
    })
  },

  async create(data: {
    content: string
    taskId: string
    parentId: string | null
    memberId: string
  }) {
    return await db.comment.create({
      data,
      include: COMMENT_INCLUDE,
    })
  },

  async update(id: string, memberId: string, data: { content: string }) {
    return await db.comment.update({
      where: { id, memberId },
      data,
      include: COMMENT_INCLUDE,
    })
  },

  async remove(id: string) {
    return await db.comment.delete({ where: { id } })
  },
})
