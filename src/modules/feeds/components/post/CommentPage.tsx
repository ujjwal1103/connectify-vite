import { getCommentsByPostId } from '@/api'
import Comments from '@/components/shared/comments/Comments'
import { IComment } from '@/interface/interfaces'
import { ChevronLeft, X } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import CommentInput from './CommentInput'
import EmplyComments from '@/components/shared/comments/EmplyComments'
import Avatar from '@/components/shared/Avatar'
import { getCurrentUser } from '@/lib/localStorage'
import { Button } from '@/components/ui/button'

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
    <div className="relative flex h-dvh w-screen flex-col overflow-hidden bg-background text-foreground md:h-auto md:w-128">
      <div className="flex w-full items-center justify-between border-b-[0.5px] border-border p-2 text-xl text-foreground">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            size={'icon'}
            className="p-0 hover:bg-background md:hidden"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-semibold">Comments</h1>
        </div>
        <Button
          variant={'ghost'}
          size="icon"
          onClick={onClose}
          className="hidden md:flex"
        >
          <X />
        </Button>
      </div>
      <div className="relative h-[calc(100%_-_52px)] md:h-auto">
        <div className="flex h-[calc(100%_-_52px)] flex-col overflow-y-scroll text-sm scrollbar-none md:h-128">
          {comments.length > 0 ? (
            <Comments
              postId={postId!}
              setReply={setReply}
              comments={comments}
              isLoading={isLoading}
              onLikeDislike={onLikeDislike}
            />
          ) : (
            <EmplyComments />
          )}
        </div>
        <div className="flex gap-2 p-2">
          <div className="flex items-center justify-center">
            <Avatar src={getCurrentUser()?.avatar?.url} className="size-6" />
          </div>
          <div className="w-full">
            <CommentInput
              postId={postId}
              onComment={addNewComment}
              setReply={setReply}
              reply={reply}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentPage
