import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from '@server/domain/commentSchema'
import { CommentService } from '@server/services/general/commentService'
import { pickFromTail } from '@server/utils/getDynamicRoute'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

export const CommentController = {
  /**
   * Assumed route: /api/db/project/{projectId}/tasks/${taskId}/comments
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  getCommentsByTaskId: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const [tid, pid] = pickFromTail(req, [1, 3])

    const isAdminOrOwner = isOrgAdminOrOwner(session)
    const comments = await CommentService.getCommentsByTaskId(
      tid,
      pid,
      session.user.id ?? '',
      isAdminOrOwner,
    )
    return Response.json(comments, { status: 200 })
  },

  /**
   * Assumed route: /api/db/project/{projectId}/tasks/${taskId}/comments
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  createComment: async (
    req: NextRequest,
    _session: Session,
    _logger: Logger,
  ) => {
    const [tid] = pickFromTail(req, [1, 3])
    // Parsing and validating body
    const body = await req.json()
    const input = CreateCommentSchema.parse(body)

    const comment = await CommentService.createComment(tid, input)
    return Response.json(comment, { status: 201 })
  },

  /**
   * Assumed route: /api/db/project/{projectId}/tasks/${taskId}/comments/${commentId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  updateComment: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    // Fetching ID from URL
    const [commentId, tid, projectId] = pickFromTail(req, [0, 2, 4])

    // Parsing and validating body
    const body = await req.json()
    const input = UpdateCommentSchema.parse(body)

    const comment = await CommentService.updateComment(
      commentId,
      tid,
      projectId,
      session.user.id ?? '',
      input,
    )
    return Response.json(comment, { status: 200 })
  },

  /**
   * Assumed route: /api/db/project/{projectId}/tasks/${taskId}/comments/${commentId}
   * @param req API request object as Next Request Type
   * @param session Validated Session from request
   * @param _logger Context Logger
   */
  deleteComment: async (
    req: NextRequest,
    session: Session,
    _logger: Logger,
  ) => {
    const [commentId, taskId, projectId] = pickFromTail(req, [0, 2, 4])

    const roleCheck = isOrgAdminOrOwner(session)
    await CommentService.deleteComment(
      commentId,
      taskId,
      projectId,
      session.user.id ?? '',
      roleCheck,
    )

    return Response.json(
      { success: true, message: 'Deleted successfully' },
      { status: 200 },
    )
  },
}
