import { likePost, unLikePost } from "@/api";
import { Heart, HeartFill } from "../icons";

type LikeButtonProps = {
  id?: string;
  isLiked: boolean;
  postUserId: string;
  commentId?: string;
  size: number;
  onLikeClick?: (isLike: boolean, error: boolean) => void;
};

export const LikeButton = ({
  id,
  isLiked,
  postUserId,
  commentId,
  onLikeClick,
}: LikeButtonProps) => {
  const handleLikeClicked = async (isLike: boolean) => {
    onLikeClick?.(isLike, false);
    try {
      if (isLike) {
        await likePost(id, postUserId, commentId);
      } else {
        await unLikePost(id, commentId);
      }
    } catch (error) {
      onLikeClick?.(isLike, true);
    }
  };

  if (isLiked) {
    return (
      <HeartFill
        className="text-red-600 cursor-pointer"
        onClick={() => handleLikeClicked(false)}
      />
    );
  }

  return (
    <Heart
      className="hover:text-muted-foreground cursor-pointer"
      onClick={() => handleLikeClicked(true)}
    />
  );
};
