import { cn, tranformUrl } from '@/lib/utils'
import { memo } from 'react'
import CheckBox from './CheckBox'
import Avatar from '@/components/shared/Avatar'
import { IUser } from '@/lib/types'
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
  showNotch: boolean
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
  showNotch,
}: MessageWrapProps) => {
  return (
    <div className={cn('group relative', className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}

      <div
        className={cn('z-10 mx-4 flex text-gray-50 duration-700', {
          'ml-auto self-end': currentUserMessage,
        })}
      >
        <div
          className={cn('flex flex-row', {
            'flex-row-reverse': !currentUserMessage,
          })}
        >
          <div className="relative flex items-center p-2 transition-all duration-300">
            <MessageMenu
              currentUserMessage={currentUserMessage}
              messageId={messageId}
              showNotch={showNotch}
            />
          </div>
          <div className="relative">
            {!currentUserMessage && showNotch && (
              <div className="mb-1 mt-3 flex gap-3">
                <UsernameLink
                  username={sender?.username}
                  className="flex gap-3"
                >
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
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MessageWrap)
