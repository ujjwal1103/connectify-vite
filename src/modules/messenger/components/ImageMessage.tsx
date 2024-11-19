import { cn } from '@/lib/utils'
import { memo } from 'react'
import MessageImage from './MessageImage'
import MetaData from './MetaData'

const ImageMessage = ({
  message,
  currentUserMessage,
  allSeen,
  showNotch,
  isLoading = false,
}: any) => {
  return (
    <div
    className={cn(
      'relative z-10  flex w-fit max-w-md flex-col rounded-xl bg-chat-bubble-user p-2 text-foreground  transition-all duration-700',
      {
        'bg-chat-bubble-self text-white ': currentUserMessage,
        "chat-bubble":showNotch
      },
  
    )}
    >
      <MessageImage src={message.attachments[0]} />

      <MetaData
        createdAt={message.createdAt}
        currentUserMessage={currentUserMessage}
        isLoading={isLoading}
        allSeen={allSeen}
        seen={message.seen}
        className="absolute bottom-3 right-3"
      />

      <div
        className={cn('absolute -bottom-3 z-20 text-lg', {
          '-left-2': currentUserMessage,
          '-right-2': !currentUserMessage,
        })}
      >
        {message?.reaction}
      </div>
    </div>
  )
}

export default memo(ImageMessage)
