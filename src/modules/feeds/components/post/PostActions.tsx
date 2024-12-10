import { memo, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { CommentIcon } from '@/components/icons'
import { LikeButton } from '@/components/shared/LikeButton'
import { IPost } from '@/lib/types'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import { useFeedSlice } from '@/redux/services/feedSlice'
import Modal from '@/components/shared/modal/Modal'
import SendPost from './SendPost'
import CommentPage from './CommentPage'
import { Send } from 'lucide-react'

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
  const [sendPost, setSendPost] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { addAndRemoveBookmark, likeUnlikePost } = useFeedSlice()

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
          <CommentIcon
            className="size-5 cursor-pointer hover:text-muted-foreground"
            onClick={() => setShowComments(true)}
          />
        )}
        <Send
          onClick={() => setSendPost(true)}
          className="cursor-pointer hover:text-muted-foreground"
        />
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
        {sendPost && (
          <Modal
            shouldCloseOutsideClick={false}
            onClose={() => setSendPost(false)}
            showCloseButton={false}
          >
            <SendPost post={post} />
          </Modal>
        )}
      </AnimatePresence>
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
