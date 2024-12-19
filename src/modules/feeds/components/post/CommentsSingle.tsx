import Comments from '@/components/shared/comments/Comments'

import { IPost } from '@/lib/types'
import { useCallback } from 'react'
import EmplyComments from '@/components/shared/comments/EmplyComments'
import { useComments } from '@/hooks/useComments'

const CommetsForPost = ({
  post,
  postId,
  setPost,
}: {
  post: IPost
  postId: string
  setPost: React.Dispatch<React.SetStateAction<IPost | null>>
}) => {
  const {
    comments,
    isLoading,
    onLikeDislikeComment,
    setReply,
    addNewComment,
    reply,
  } = useComments(postId)

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
    <div>
      
      {comments.length > 0 ? (
        <Comments
          postId={postId!}
          setReply={setReply}
          comments={comments}
          isLoading={isLoading}
          onLikeDislike={onLikeDislikeComment}
        />
      ) : (
        <EmplyComments />
      )}
    </div>
  )
}

export default CommetsForPost
