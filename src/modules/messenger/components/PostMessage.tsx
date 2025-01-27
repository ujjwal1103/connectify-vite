import UsernameLink from '@/components/shared/UsernameLink'
import { tranformUrl, cn } from '@/lib/utils'
import Avatar from '@/components/shared/Avatar'
import { Link } from 'react-router-dom'
import { IMessage } from '@/lib/types'
import MetaData from './MetaData'

interface PostMessageProps {
  currentUserMessage: boolean
  allSeen: boolean
  className?: string
  showNotch: boolean
  message: IMessage
}

const PostMessage = ({ className, message, showNotch }: PostMessageProps) => {
  const {
    isUnavailable,
    post,
    isCurrentUserMessage,
    isEdited,
    reaction,
    createdAt,
    seen,
    isLoading,
  } = message

  if (isUnavailable) {
    return (
      <div className={className}>
        <div>Post unavailable</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative z-10 flex w-fit max-w-md flex-col rounded-xl bg-message-background text-foreground transition-all duration-700',
        {
          'bg-chat-bubble-self ': isCurrentUserMessage,
          'chat-bubble': showNotch,
        }
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <Avatar
          src={post?.user?.avatar?.url}
          className={'size-7 rounded-full'}
        />
        <UsernameLink
          username={post?.user?.username!}
          className={cn('text-black', {
            'text-white': isCurrentUserMessage,
          })}
        >
          {post?.user?.username}
        </UsernameLink>
      </div>
      <div className="">
        <Link to={`/p/${post?._id}`}>
          <img
            className="h-52 w-52 rounded-xl"
            alt={'postImage'}
            src={tranformUrl(post?.images?.[0]?.url, 300)!}
          />
        </Link>
      </div>
      {post?.caption && (
        <div className="w-full overflow-hidden break-words py-2">
          <span>{post?.caption}</span>
        </div>
      )}

      <MetaData
        isEdited={isEdited}
        createdAt={createdAt}
        currentUserMessage={isCurrentUserMessage}
        isLoading={isLoading}
        allSeen={false}
        seen={seen}
        className="self-end absolute top-1 right-1"
        reaction={reaction}
      />
    </div>
  )
}

export default PostMessage
