import { memo, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

// import { CommentIcon } from '@/components/icons'
import { LikeButton } from '@/components/shared/LikeButton'
import { IPost } from '@/lib/types'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import Modal from '@/components/shared/modal/Modal'
import CommentPage from './CommentPage'
import { MessageCircle } from 'lucide-react'
import useFeedStore from '@/stores/Feeds'
import ShareButton from '@/components/posts/ShareButton'

type PostActionsProps = {
  post: IPost
  showCurrentPost?: VoidFunction
  size?: number
  showCommentButton?: boolean
  onLike?: (isLike: boolean) => void
  onBookmark?: (isBookmarked: boolean) => void
}

const PostActions = ({
  post,
  size = 24,
  showCommentButton = true,
  onLike,
  onBookmark,
}: PostActionsProps) => {
  const [showComments, setShowComments] = useState(false)
  const { likeUnlikePost, addAndRemoveBookmark } = useFeedStore()

  const handleLikeClicked = useCallback(
    async (isLike: boolean, error: boolean) => {
      if (error) return
      onLike && onLike(isLike)
      likeUnlikePost(isLike, post._id)
    },
    [post]
  )

  return (
    <div className="flex items-center justify-between px-2 pt-2 text-primary">
      <div className="flex items-center gap-2 text-xl md:gap-3">
        <LikeButton
          isLiked={post?.isLiked}
          size={size}
          id={post?._id}
          onLikeClick={handleLikeClicked}
          postUserId={post?.user?._id}
        />
        {showCommentButton && (
          <MessageCircle
            size={size}
            className="cursor-pointer hover:text-muted-foreground"
            onClick={() => setShowComments(true)}
          />
        )}
        <ShareButton post={post} />
      </div>

      <BookmarkButton
        postId={post?._id}
        isBookmarked={post.isBookmarked}
        onBookmarkClick={(isBookmarked) => {
          onBookmark?.(isBookmarked)
          addAndRemoveBookmark(isBookmarked, post?._id)
        }}
      />
      <AnimatePresence>
        {showComments && (
          <Modal
            shouldCloseOutsideClick={false}
            onClose={() => setShowComments(false)}
            showCloseButton={false}
          >
            <CommentPage
              postId={post?._id}
              onClose={() => setShowComments(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(PostActions)
