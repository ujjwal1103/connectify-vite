import { createBookmark, deleteBookmark } from '@/api'
import { BookmarkIcon } from 'lucide-react'

type BookmarkButtonProps = {
  postId: string
  isBookmarked: boolean

  onBookmarkClick: (isBookmarked: boolean, error: boolean) => void
}

export const BookmarkButton = ({
  postId,
  isBookmarked,
  onBookmarkClick,
}: BookmarkButtonProps) => {
  const handleLikeClicked = async (isBookmarked: boolean) => {
    onBookmarkClick(isBookmarked, false)
    try {
      if (isBookmarked) {
        await createBookmark(postId)
      } else {
        await deleteBookmark(postId)
      }
    } catch (error) {
      onBookmarkClick(isBookmarked, true)
    }
  }

  if (isBookmarked) {
    return (
      <BookmarkIcon
        className="cursor-pointer fill-white text-base md:text-xl"
        onClick={() => handleLikeClicked(false)}
      />
    )
  }

  return (
    <BookmarkIcon
      className="cursor-pointer text-base text-white md:text-xl"
      
      onClick={() => handleLikeClicked(true)}
    />
  )
}
