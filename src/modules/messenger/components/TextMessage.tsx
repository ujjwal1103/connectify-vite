import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import MetaData from './MetaData'
import { IMessage } from '@/lib/types'
import { hightlightandscrollTo } from '@/components/Events/Hightlight'

type TextMessageProps = {
  currentUserMessage: boolean
  allSeen: boolean
  showNotch: boolean
  message: IMessage
}

const TextMessage = ({ showNotch, message }: TextMessageProps) => {
  const [msg, setMsg] = useState(message)
  const { text, isLoading, isEdited, isCurrentUserMessage } = msg
  const [showMore, setShowMore] = useState(false)
  const messageLength = text?.length
  const longMessage = messageLength > 200 && messageLength - 200 > 250
  const [hightlight, setHighlight] = useState(false)
  const messageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMsg(message)
  }, [message])

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const highlightandscrollMessage = (e: any) => {
    if (e.detail._id === message._id) {
      messageRef?.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
      setHighlight(e.detail._id === message._id)
    }

    setTimeout(() => {
      setHighlight(false)
    }, 800)
  }

  useEffect(() => {
    hightlightandscrollTo.addEventListener(
      'hightlight',
      highlightandscrollMessage
    )
    return () =>
      hightlightandscrollTo.removeEventListener(
        'hightlight',
        highlightandscrollMessage
      )
  }, [hightlight])

  const isReply = Boolean(message.reply?._id)

  const handleClickReply = () => {
    hightlightandscrollTo.dispatchEvent(
      new CustomEvent('hightlight', { detail: message.reply })
    )
  }

  return (
    <div
      ref={messageRef}
      className={cn(
        'relative z-10 cursor-pointer flex w-fit max-w-md flex-col rounded-xl bg-message-background p-2 text-foreground transition-all duration-700',
        {
          'bg-chat-bubble-self text-white': isCurrentUserMessage,
          'chat-bubble': showNotch,
          'bg-purple-400': hightlight,
        }
      )}
    >
      {isReply && (
        <div
          onClick={handleClickReply}
          className="mb-2 flex overflow-clip rounded-md bg-secondary"
        >
          <div className="flex flex-col border-l-4 border-purple-800 p-2">
            <div className="mb-1 text-purple-800">
              {message?.reply?.sender?.username}
            </div>
            <div className="line-clamp-2">{message?.reply?.text}</div>
          </div>
        </div>
      )}
      <div
        className={cn(
          'overflow-hidden break-words rounded-md text-sm text-black',
          isCurrentUserMessage && 'text-white'
        )}
      >
        {showMore ? text : text?.slice(0, 300) + (longMessage ? '...' : '')}{' '}
        {longMessage && (
          <button
            onClick={toggleShowMore}
            className="rounded-2xl p-1 text-sm font-semibold text-blue-500"
          >
            {showMore ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      {isEdited && <span className="text-xs opacity-50">(Edited)</span>}

      <MetaData
        isEdited={isEdited}
        createdAt={message.createdAt}
        currentUserMessage={isCurrentUserMessage}
        isLoading={isLoading}
        allSeen={false}
        seen={message.seen}
        className="self-end"
        reaction={message.reaction}
      />
    </div>
  )
}

export default TextMessage
