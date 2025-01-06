import UsernameLink from '@/components/shared/UsernameLink'
import Avatar from '@/components/shared/Avatar'
import { IPost } from '@/lib/types'
import { memo } from 'react'
import PostHeaderMenu from './PostHeaderMenu'

type PostHeaderProps = {
  postId: string
  userId: string
  userAvatar?: string
  name: string
  username: string
  location?: string
  post: IPost
}

const PostHeader = ({
  postId,
  userId,
  userAvatar,
  name,
  username,
  location,
  post,
}: PostHeaderProps) => {
  return (
    <div className="text-secondary-foregroun flex w-full items-center justify-between gap-6 p-2">
      <div className="flex flex-1 items-center gap-3">
        <Avatar
          src={userAvatar}
          className="size-8 rounded-full md:size-10"
          name={name}
        />
        <div className="flex flex-col">
          <UsernameLink username={username} onClick={() => {}}>
            <span className="text-sm">{username}</span>
          </UsernameLink>
          <span>{location}</span>
        </div>
      </div>

      <PostHeaderMenu post={post} postId={postId} userId={userId} />
    </div>
  )
}

export default memo(PostHeader)
