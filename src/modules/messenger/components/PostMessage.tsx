import UsernameLink from '@/components/shared/UsernameLink'
import { tranformUrl, getReadableTime } from '@/lib/utils'
import Avatar from '@/components/shared/Avatar'
import { Link } from 'react-router-dom'
import Notch from './Notch'
import { IMessage } from '@/lib/types'
import { Check, CheckCheck } from 'lucide-react'

interface PostMessageProps {
  currentUserMessage: boolean
  allSeen: boolean
  className?: string
  showNotch: boolean
  message: IMessage
}

const PostMessage = ({
  currentUserMessage,
  allSeen,
  className,
  message,
  showNotch,
}: PostMessageProps) => {
  const { isUnavailable, post, createdAt, seen } = message

  if (isUnavailable) {
    return (
      <div className={className}>
        <div>Post unavailable</div>
      </div>
    )
  }

  return (
    <div
      className={`z-10 w-52 max-w-md rounded-xl p-2 transition-all duration-700 ${
        currentUserMessage ? 'ml-auto self-end bg-secondary' : 'bg-black'
      } relative text-gray-50`}
    >
      <div className="flex items-center gap-3 py-2">
        <Avatar
          src={post?.user?.avatar?.url}
          className={'size-10 rounded-full'}
        />
        <UsernameLink username={post?.user?.username!}>
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

      <div className="float-right flex w-fit flex-col items-center justify-end p-1 text-right text-xss text-gray-300">
        <span className="z-[1] flex items-center gap-3 text-white">
          {getReadableTime(createdAt)}
          {currentUserMessage &&
            (seen || allSeen ? (
              <CheckCheck className="text-blue-500" />
            ) : (
              <Check />
            ))}
        </span>
      </div>
      {showNotch && <Notch currentUserMessage={currentUserMessage} />}
    </div>
  )
}

export default PostMessage
