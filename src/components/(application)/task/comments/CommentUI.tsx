import type { Comment } from '@prisma/client'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Textarea } from '@ui/textarea'
import type { User } from 'next-auth'
import React, { type FC } from 'react'

interface CommentProps {
  comment: Comment & { user: User }
  replies: (Comment & { user: User; replies: Comment[] })[]
}

const CommentUI: FC<CommentProps> = ({ comment, replies }) => {
  const [showReplyBox, setShowReplyBox] = React.useState(false)

  return (
    <div className="my-4">
      <Card>
        <CardHeader>
          <CardTitle>{comment.memberId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyBox(!showReplyBox)}
          >
            Reply
          </Button>
          {showReplyBox && (
            <div className="mt-2">
              <Textarea placeholder="Write your reply..." />
              <Button size="sm" className="mt-2">
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="ml-6">
        {replies && replies.length > 0 && (
          <div>
            {replies.map((reply) => (
              <CommentUI key={reply.id} comment={reply} replies={[reply]} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentUI
