import Comments from '@/components/shared/comments/Comments'

import { IPost } from '@/lib/types'
import EmplyComments from '@/components/shared/comments/EmplyComments'
import { useComments } from '@/hooks/useComments'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import Caption from './Caption'
import { LikeButton } from '@/components/shared/LikeButton'
import ShareButton from '@/components/posts/ShareButton'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import CommentInput from './CommentInput'

const CommetsForPost = ({
  postId,
  post,
  isActive,
}: {
  post: IPost
  postId: string
  isActive: boolean
  setPost: React.Dispatch<React.SetStateAction<IPost | null>>
}) => {
  const {
    comments,
    isLoading,
    onLikeDislikeComment,
    setReply,
    addNewComment,
    reply,
  } = useComments(postId, isActive)

  const commentRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="flex h-[calc(100%_-_57px)] flex-col justify-between md:w-80 lg:w-128">
      <div ref={commentRef} className={cn('w-full flex-1 overflow-y-scroll')}>
        {post.caption && (
          <div className="p-3">
            <Caption user={post.user} caption={post.caption} showUser={true} />
          </div>
        )}
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
      <div className="w-full border-t border-border">
        <div className="flex gap-3 p-3">
          <LikeButton
            isLiked={post.isLiked}
            postUserId={post.user._id}
            size={24}
            id={post._id}
          />

          <ShareButton post={post} />
          <div className="ml-auto">
            <BookmarkButton
              postId={post?._id}
              isBookmarked={post.isBookmarked}
              onBookmarkClick={() => {}}
            />
          </div>
        </div>
        <div className="flex flex-col px-3 pb-2 text-base font-semibold text-white">
          <span>{post.like} Likes</span>
          {/* <span>{formatDate('12-12-2024')}</span> */}
        </div>
        <div className="relative flex w-full items-center border-t border-border p-2">
          <CommentInput
            postId={post?._id!}
            onComment={addNewComment}
            setReply={setReply}
            reply={reply}
          />
        </div>
      </div>
    </div>
  )
}

export default CommetsForPost
