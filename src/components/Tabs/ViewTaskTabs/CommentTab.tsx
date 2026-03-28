import apiRequest from '@hooks/query'
import { Avatar, AvatarFallback } from '@ui/avatar'
import { Button } from '@ui/button'
import { Card, CardContent } from '@ui/card'
import { Textarea } from '@ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

interface CommentTabProps {
  projectId: string
  taskId: string
}

const CommentTab = ({ taskId, projectId }: CommentTabProps) => {
  const [newComment, setNewComment] = useState('')

  const { data: comments } = apiRequest.comment.fetchByTaskId.useQuery(
    projectId,
    taskId,
  )

  const handleSubmit = async () => {
    // TODO
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
          disabled={!newComment.trim()}
          className="w-full sm:w-auto"
        >
          Add Comment
        </Button>
      </div>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.memberName}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.memberName}</p>
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

        {comments?.length === 0 && (
          <div className="text-center text-muted-foreground text-sm p-4">
            No comments yet
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentTab
