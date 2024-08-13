import { getCommentsByPostId } from '@/api'
import Comments from '@/components/shared/comments/Comments'
import { IComment } from '@/interface/interfaces'
import { X } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import CommentInput from './CommentInput'

interface CommentPageProps {
  postId: string
  onClose: () => void
}
const CommentPage = ({ postId, onClose }: CommentPageProps) => {
  const [reply, setReply] = useState<any>({
    isReply: false,
    commentId: null,
    repliedTo: null,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<IComment[]>([])

  const getComments = useCallback(async () => {
    const res = (await getCommentsByPostId(postId as string)) as any
    setComments(res.comments)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getComments()
  }, [])
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground md:h-auto md:w-500">
      <div className="flex items-center justify-between border-b border-border p-3">
        <h1>Comments {postId}</h1>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className=" relative">
        <div className="flex-1 overflow-y-scroll text-sm scrollbar-none h-[calc(100dvh_-_85px)] md:h-500">
          {comments.reverse().length > 0 ? (
            <Comments
              postId={postId!}
              setReply={setReply}
              comments={comments}
              isLoading={isLoading}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              No comments found
            </div>
          )}
        </div>
        <div className="">
          <CommentInput
            postId={postId}
            onComment={getComments}
            setReply={setReply}
            reply={reply}
          />
        </div>
      </div>
    </div>
  )
}

export default CommentPage
