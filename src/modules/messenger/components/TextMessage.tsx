import { cn } from '@/lib/utils'
import { useState } from 'react'
import Notch from './Notch'
import MetaData from './MetaData'

const TextMessage = ({
  currentUserMessage,
  allSeen,
  showNotch,
  message,
}: any) => {
  const { text, isLoading } = message
  const [showMore, setShowMore] = useState(false)
  const messageLength = text?.length
  const longMessage = messageLength > 200 && messageLength - 200 > 250

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <div
      className={cn(
        'relative z-10 flex w-fit max-w-md flex-col rounded-xl bg-black p-2 text-gray-50 shadow-2xl transition-all duration-700',
        {
          'bg-zinc-800': currentUserMessage,
        }
      )}
    >
      <div className="overflow-hidden break-words text-sm">
        {showMore ? text : text?.slice(0, 300) + (longMessage ? '...' : '')}
      </div>

      {longMessage && (
        <button
          onClick={toggleShowMore}
          className="self-start rounded-2xl p-1 text-sm font-semibold text-blue-500"
        >
          {showMore ? 'Read Less' : 'Read More'}
        </button>
      )}

      <MetaData
        createdAt={message.createdAt}
        currentUserMessage={currentUserMessage}
        isLoading={isLoading}
        allSeen={allSeen}
        seen={message.seen}
        className="self-end"
        reaction={message.reaction}
      />

      {showNotch && <Notch currentUserMessage={currentUserMessage} />}
    </div>
  )
}

export default TextMessage
