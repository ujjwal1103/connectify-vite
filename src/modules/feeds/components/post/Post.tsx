import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostInteraction from "./PostInteraction";
import { memo } from "react";
import { IPost } from "@/lib/types";
const Post = ({ post }: { post: IPost }) => {
  return (
    <article
      id={post._id}
      className="overflow-hidden mb-2 md:bg-card bg-transparent md:border-none border-b border-border text-secondary-foreground flex md:rounded-md drop-shadow-md  relative"
    >
      <div className="flex-col justify-between flex-1">
        <PostHeader post={post} />
        <PostContent contentUrls={post?.images} />
        <PostActions post={post} showCommentButton={true} />
        <PostInteraction post={post} />
      </div>
    </article>
  );
};

export default memo(Post);
