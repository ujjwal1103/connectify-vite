import { getCommentsByPostId } from '@/api'
import { IComment } from '@/interface/interfaces'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

export type ReplyType = {
  isReply: boolean
  commentId: string | null
  repliedTo: string | null
}

export const useComments = (postId: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<IComment[]>([])
  const [reply, setReply] = useState<ReplyType>({
    isReply: false,
    commentId: null,
    repliedTo: null,
  })

  useEffect(() => {
    getComments()
  }, [])


  const getComments = useCallback(async () => {
    try {
      const res = (await getCommentsByPostId(postId as string)) as any
      setComments(res.comments)
    } catch (error) {
      setError('Unable to load comments')
    } finally {
      setIsLoading(false)
    }
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

  const updateCommentLikesDislikes = useCallback(
    (comments: IComment[], commentId: string, isLiked: boolean): IComment[] => {
      return comments.map((c) => {
        if (c._id === commentId) {
          console.log(c)
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
    },
    [comments]
  )

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

  return {
    comments,
    isLoading,
    reply,
    error,
    setReply,
    onLikeDislikeComment,
    updateCommentLikesDislikes,
    addNewComment,
  }
}
