import { cn } from '@/lib/utils'
import {  useEffect, useState } from 'react'
import MetaData from './MetaData'
import { IMessage } from '@/lib/types'

type TextMessageProps = {
  currentUserMessage: boolean
  allSeen: boolean
  showNotch: boolean
  message: IMessage
}

const TextMessage = ({
  allSeen,
  showNotch,
  message,
}: TextMessageProps) => {
  const [msg, setMsg] = useState(message)
  const { text, isLoading, isEdited, isCurrentUserMessage } = msg
  const [showMore, setShowMore] = useState(false)
  const messageLength = text?.length
  const longMessage = messageLength > 200 && messageLength - 200 > 250

  useEffect(()=>{
    setMsg(message)
  },[message])

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <div
      className={cn(
        'relative z-10 flex w-fit max-w-md flex-col  rounded-xl bg-message-background p-2 text-foreground transition-all duration-700',
        {
          'bg-chat-bubble-self text-white': isCurrentUserMessage,
          'chat-bubble': showNotch,
        }
      )}
    >
      <div className={cn("overflow-hidden break-words text-sm text-black",isCurrentUserMessage && 'text-white')}>
        {showMore ? text : text?.slice(0, 300) + (longMessage ? '...' : '')}
      </div>
      {isEdited && <span className='text-xs opacity-50'>(Edited)</span>}

      {longMessage && (
        <button
          onClick={toggleShowMore}
          className="self-start rounded-2xl p-1 text-sm font-semibold text-blue-500"
        >
          {showMore ? 'Read Less' : 'Read More'}
        </button>
      )}

      <MetaData
        isEdited={isEdited}
        createdAt={message.createdAt}
        currentUserMessage={isCurrentUserMessage}
        isLoading={isLoading}
        allSeen={allSeen}
        seen={message.seen}
        className="self-end"
        reaction={message.reaction}
      />
    </div>
  )
}

export default TextMessage
