import { getCommentsByPostId } from '@/api'
import Comments from '@/components/shared/comments/Comments'
import { IComment } from '@/interface/interfaces'
import { IPost } from '@/lib/types'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import CommentInput from './CommentInput'
import PostActions from './PostActions'
import { toast } from 'react-toastify'

const CommentComponent = ({ post, postId, setPost }: any) => {
  const [reply, setReply] = useState<any>({
    isReply: false,
    commentId: null,
    repliedTo: null,
  })

  useEffect(() => {
    getComments()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<IComment[]>([])

  const getComments = useCallback(async () => {
    const res = (await getCommentsByPostId(postId as string)) as any
    setComments(res.comments)
    setIsLoading(false)
  }, [])

  const addNewComment = useCallback(
    (comment: IComment, isReply: boolean) => {
      const insertReply = (
        comments: IComment[],
        reply: IComment
      ): IComment[] => {
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
    },
    [comments]
  )

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

  const onLikeDislikeComment = useCallback(
    (commentId: string, isLiked: boolean) => {
      try {
        setComments((prevComments) =>
          updateCommentLikesDislikes(prevComments, commentId, isLiked)
        )
      } catch (error) {
        toast.error('Failed to update like/dislike')
      }
    },
    [comments]
  )

  const onLikeDislikePost = useCallback(
    (liked: boolean) => {
      setPost((prev: any) => {
        const p = { ...prev, isLiked: liked } as IPost
        return p
      })
    },
    [post]
  )

  const onBookmarkPost = useCallback(
    (bookmark: boolean) => {
      setPost((prev: any) => {
        return {
          ...prev,
          isBookmarked: bookmark,
        } as IPost
      })
    },
    [post]
  )

  return (
    <div className="hidden h-full flex-1 flex-col overflow-hidden md:flex">
      <div className="flex-1 overflow-y-scroll text-sm scrollbar-none">
        {comments.length > 0 ? (
          <Comments
            postId={postId!}
            setReply={setReply}
            comments={comments}
            isLoading={isLoading}
            onLikeDislike={onLikeDislikeComment}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            No comments found
          </div>
        )}
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        className="flex w-full flex-col bg-zinc-950 px-3 py-2"
      >
        <div className="mb-3">
          <PostActions
            post={post!}
            showCommentButton={false}
            onLike={onLikeDislikePost}
            onBookmark={onBookmarkPost}
          />
        </div>

        <div>
          <CommentInput
            postId={post?._id!}
            onComment={addNewComment}
            setReply={setReply}
            reply={reply}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default CommentComponent
