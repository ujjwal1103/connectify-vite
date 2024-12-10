import { getCommentsByPostId } from '@/api'
import { IComment } from '@/interface/interfaces'
import { useCallback, useEffect, useState } from 'react'
import Avatar from '../Avatar'
import UsernameLink from '../UsernameLink'
import moment from 'moment'
import { LikeButton } from '../LikeButton'
import { CommentText } from './CommentText'
import { CommentList } from './CommentList'
import { commentExpand } from '@/components/Events/CommentExpand'
import { ReplyType } from '@/hooks/useComments'

export const Comment = ({
  comment,
  setReply,
  root = false,
  onLikeDislike,
}: {
  comment: IComment
  setReply: React.Dispatch<React.SetStateAction<ReplyType>>
  root: boolean
  onLikeDislike: (commentId: string, isLiked: boolean) => void
}) => {
  const [currentComment, setCurrentComment] = useState(comment)
  const [childComments, setChildComments] = useState<IComment[]>([])
  const [showHiddenReply, setShowHiddenReply] = useState(false)

  const expand = (e: any) => {
    if (e.detail === currentComment._id) {
      handleGetComments()
    }
  }

  useEffect(() => {
    setCurrentComment(comment)
    commentExpand.addEventListener('expand', expand)
    if (showHiddenReply) {
      handleGetComments()
    }
    return () => commentExpand.removeEventListener('expand', expand)
  }, [comment])

  const handleGetComments = async () => {
    console.count('called')

    try {
      const res = (await getCommentsByPostId(
        currentComment?.post?._id,
        currentComment?._id
      )) as any
      setChildComments(res?.comments)
      setShowHiddenReply(true)
    } catch (error) {
      console.log(error)
    }
  }

  const onLikeClick = useCallback(
    (isLike: boolean) => {
      onLikeDislike(currentComment?._id, isLike)
    },
    [currentComment]
  )

  return (
    <div
      key={currentComment._id}
      className={`mb-2 first:mt-2 ${
        !root && 'border-l'
      } border-zinc-700 pl-2 dark:text-gray-50`}
    >
      <div className="flex items-start gap-4">
        <div className=" ">
          <Avatar
            src={currentComment?.user?.avatar?.url}
            className="size-8 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-sm">
          <UsernameLink
            username={currentComment?.user?.username}
            className="font-semibold"
          >
            <span>{currentComment?.user?.username}</span>
          </UsernameLink>
          <span className="pl-2">
            <CommentText
              comment={currentComment?.comment}
              mentions={currentComment?.mentions}
            />
          </span>
          <div className="flex gap-5 text-gray-500">
            <span>{moment(currentComment.updatedAt).fromNow(true)}</span>
            <span>{currentComment?.like} likes</span>
            <button
              onClick={() => {
                setReply({
                  isReply: true,
                  commentId: currentComment._id,
                  repliedTo: currentComment.user.username,
                })
              }}
            >
              reply
            </button>
          </div>
        </div>
        <LikeButton
          size={15}
          isLiked={currentComment?.isLiked}
          postUserId={currentComment?.post?.userId}
          commentId={currentComment?._id}
          id={undefined}
          onLikeClick={onLikeClick}
        />
      </div>

      <div className="">
        {currentComment?.childComments?.length > 0 && (
          <>
            {showHiddenReply && (
              <CommentList
                comments={childComments}
                setReply={setReply}
                root={false}
                onLikeDislike={onLikeDislike}
              />
            )}
            {!showHiddenReply ? (
              <button
                className="ml-12 text-sm"
                onClick={() => handleGetComments()}
              >
                show {currentComment?.childComments?.length} replies
              </button>
            ) : (
              <button
                className="ml-12 text-sm"
                onClick={() => setShowHiddenReply(false)}
              >
                Hide {currentComment?.childComments?.length} replies
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
