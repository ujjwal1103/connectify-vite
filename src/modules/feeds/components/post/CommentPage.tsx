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

  const addNewComment = (comment: IComment, isReply: boolean) => {
    const insertReply = (comments: IComment[], reply: IComment): IComment[] => {
      return comments.map((c: IComment) => {
        if (c._id === reply.parrentComment) {
          return {
            ...c,
            childComments: [...(c.childComments || []), reply],
          }
        } else if (c.childComments) {
          return {
            ...c,
            childComments: insertReply(c.childComments, reply),
          }
        }
        return c
      })
    }

    if (isReply) {
      setComments((prevComments) => insertReply(prevComments, comment))
    } else {
      setComments((prevComments) => [comment, ...prevComments])
    }
  }

  const updateCommentLikesDislikes = (
    comments: IComment[],
    commentId: string,
    isLiked: boolean
  ): IComment[] => {
    return comments.map((c) => {
      if (c._id === commentId) {
        return {
          ...c,
          like: isLiked ? c.like + 1 : Math.max(c.like - 1, 0),
          isLiked: isLiked,
        }
      } else if (c.childComments) {
        return {
          ...c,
          childComments: updateCommentLikesDislikes(
            c.childComments,
            commentId,
            isLiked
          ),
        }
      }
      return c
    })
  }

  const onLikeDislike = (commentId: string, isLiked: boolean) => {
    try {
      setComments((prevComments) =>
        updateCommentLikesDislikes(prevComments, commentId, isLiked)
      )
    } catch (error) {
      console.error('Failed to update like/dislike', error)
    }
  }

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-background text-foreground md:h-auto md:w-500">
      <div className="flex items-center justify-between border-b border-border p-3">
        <h1>Comments {postId}</h1>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="relative">
        <div className="h-[calc(100dvh_-_85px)] flex-1 overflow-y-scroll text-sm scrollbar-none md:h-500">
          {comments.length > 0 ? (
            <Comments
              postId={postId!}
              setReply={setReply}
              comments={comments}
              isLoading={isLoading}
              onLikeDislike={onLikeDislike}
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
            onComment={addNewComment}
            setReply={setReply}
            reply={reply}
          />
        </div>
      </div>
    </div>
  )
}

export default CommentPage
