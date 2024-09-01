import { cn } from '@/lib/utils'
import { memo } from 'react'
import Notch from './Notch'
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
        'relative flex w-fit max-w-md flex-col rounded-xl bg-black p-2 text-gray-50 shadow-2xl transition-all duration-700',
        {
          'bg-zinc-800': currentUserMessage,
        }
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

      {showNotch && <Notch currentUserMessage={currentUserMessage} />}

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
