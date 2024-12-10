import Comments from '@/components/shared/comments/Comments'

import { IPost } from '@/lib/types'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import CommentInput from './CommentInput'
import PostActions from './PostActions'
import EmplyComments from '@/components/shared/comments/EmplyComments'
import { useComments } from '@/hooks/useComments'

const CommentComponent = ({
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
          <EmplyComments />
        )}
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        className="flex w-full flex-col px-3 py-2"
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
