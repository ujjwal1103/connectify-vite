import { createBookmark, deleteBookmark } from "@/api";
import { BookMark, BookMarkFill } from "../icons";

type BookmarkButtonProps = {
  postId: string;
  isBookmarked: boolean;

  onBookmarkClick: (isBookmarked: boolean, error: boolean) => void;
};

export const BookmarkButton = ({
  postId,
  isBookmarked,
  onBookmarkClick,
}: BookmarkButtonProps) => {
  const handleLikeClicked = async (isBookmarked: boolean) => {
    onBookmarkClick(isBookmarked, false);
    try {
      if (isBookmarked) {
        await createBookmark(postId);
      } else {
        await deleteBookmark(postId);
      }
    } catch (error) {
      onBookmarkClick(isBookmarked, true);
    }
  };

  if (isBookmarked) {
    return (
      <BookMarkFill
        className="cursor-pointer text-base md:text-xl"
        onClick={() => handleLikeClicked(false)}
      />
    );
  }

  return (
    <BookMark
      className="cursor-pointer text-base md:text-xl"
      color=""
      onClick={() => handleLikeClicked(true)}
    />
  );
};
