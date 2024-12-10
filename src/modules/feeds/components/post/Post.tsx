import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostActions from './PostActions'
import PostInteraction from './PostInteraction'
import { memo } from 'react'
import { IPost } from '@/lib/types'
const Post = ({ post }: { post: IPost }) => {
  return (
    <article
      id={post._id}
      className="relative mb-2 flex overflow-hidden border-b border-border bg-transparent text-secondary-foreground drop-shadow-md md:rounded-md md:border-none md:bg-card"
    >
      <div className="flex-1 flex-col justify-between">
        <PostHeader 
          post={post}
          postId={post._id}
          userId={post.user._id}
          name={post.user.name}
          username={post.user.username}
          userAvatar={post.user.avatar?.url}
        />
        <PostContent images={post?.images} />
        <PostActions post={post} showCommentButton={true} />
        <PostInteraction post={post} />
      </div>
    </article>
  )
}

export default memo(Post)
