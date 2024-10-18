import { cn, tranformUrl } from '@/lib/utils'
import { memo } from 'react'
import CheckBox from './CheckBox'
import Avatar from '@/components/shared/Avatar'
import { IMessage, IUser } from '@/lib/types'
import UsernameLink from '@/components/shared/UsernameLink'
import MessageMenu from './MessageMenu'

interface MessageWrapProps {
  children: React.ReactNode
  isSelectMessages: boolean
  isMessageSelected: boolean
  handleSelectMessage: () => void
  className?: string
  currentUserMessage: boolean
  sender: IUser
  messageId: string
  showProfile: boolean
  message: IMessage
}

const MessageWrap = ({
  children,
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  className,
  currentUserMessage,
  sender,
  messageId,
  showProfile,
  message
}: MessageWrapProps) => {
  return (
    <div className={cn('relative flex-col', className)}>
      {!currentUserMessage && showProfile && (
        <div className="mb-1 ml-3 mt-3 flex gap-3">
          <UsernameLink username={sender?.username} className="flex gap-3">
            <div className="size-5">
              <Avatar
                src={tranformUrl(sender?.avatar?.url, 100)!}
                className="size-5"
              />
            </div>
            <span className="text-xs">{sender?.username}</span>
          </UsernameLink>
        </div>
      )}
      <div className="flex" onClick={handleSelectMessage}>
        <div
          className={cn(
            'flex -translate-x-8 items-center transition-transform duration-150',
            {
              'translate-x-0': isSelectMessages,
            }
          )}
        >
          <CheckBox
            isMessageSelected={isMessageSelected}
            handleSelectMessage={handleSelectMessage}
          />
        </div>
        <div
          className={cn(
            'z-5 mx-4 flex -translate-x-8 text-gray-50 transition-transform duration-150',
            {
              'ml-auto translate-x-0 self-end': currentUserMessage,
              'translate-x-0': isSelectMessages,
            }
          )}
        >
          <div
            className={cn('group flex flex-row', {
              'flex-row-reverse': !currentUserMessage,
            })}
          >
            <div className="relative flex items-center p-2 transition-all duration-300">
              <MessageMenu
                currentUserMessage={currentUserMessage}
                messageId={messageId}
                message={message}
              />
            </div>
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MessageWrap)
