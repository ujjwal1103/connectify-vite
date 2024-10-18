import { likePost, unLikePost } from '@/api'
import { HeartIcon } from 'lucide-react'
import { memo } from 'react'

type LikeButtonProps = {
  id?: string
  isLiked: boolean
  postUserId: string
  commentId?: string
  size: number
  onLikeClick?: (isLike: boolean, error: boolean) => void
}

export const LikeButton = memo(
  ({ id, isLiked, postUserId, commentId, onLikeClick }: LikeButtonProps) => {
    const handleLikeClicked = async (isLike: boolean) => {
      onLikeClick?.(isLike, false)
      try {
        if (isLike) {
          await likePost(id, postUserId, commentId)
        } else {
          await unLikePost(id, commentId)
        }
      } catch (error) {
        onLikeClick?.(isLike, true)
      }
    }

    if (isLiked) {
      return (
        <HeartIcon
          className="cursor-pointer fill-red-600"
          onClick={() => handleLikeClicked(false)}
        />
      )
    }

    return (
      <HeartIcon
        className="cursor-pointer hover:text-muted-foreground"
        onClick={() => handleLikeClicked(true)}
      />
    )
  }
)
