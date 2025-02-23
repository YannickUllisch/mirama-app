import { useState } from 'react'
import { Button } from '@ui/button'
import { Textarea } from '@ui/textarea'
import { Card, CardContent } from '@ui/card'
import { Avatar, AvatarFallback } from '@ui/avatar'
import type { Comment, User } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import useSWR from 'swr'

interface CommentTabProps {
  taskId?: string
  onAddComment?: (comment: string) => Promise<void>
}

export default function CommentTab({ taskId, onAddComment }: CommentTabProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: taskComments } = useSWR<
    (Comment & {
      user: User
    })[]
  >(taskId ? `task/comments?taskId=${taskId}` : null)

  const handleSubmit = async () => {
    if (!newComment.trim() || !onAddComment) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          className="w-full sm:w-auto"
        >
          Add Comment
        </Button>
      </div>

      <div className="space-y-4">
        {taskComments?.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.user?.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {taskComments?.length === 0 && (
          <div className="text-center text-muted-foreground text-sm p-4">
            No comments yet
          </div>
        )}
      </div>
    </div>
  )
}
