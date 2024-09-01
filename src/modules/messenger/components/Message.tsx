import { memo, useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'

import { useChatSlice } from '@/redux/services/chatSlice'
import TextMessage from './TextMessage'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import AudioMessage from './AudioMessage'
import PostMessage from './PostMessage'
import MessageWrap from './MessageWrap'
import { IMessage } from '@/lib/types'

interface MessageProps {
  currentUserMessage: boolean
  seen: boolean
  isMessageSelected: boolean
  message: IMessage
  isNextMessageUsMine: boolean
  isLastMessagae: boolean
}

const Message = ({
  currentUserMessage,
  seen: allSeen,
  isMessageSelected,
  message,
  isNextMessageUsMine,
  isLastMessagae,
}: MessageProps) => {
  const { messageType, _id } = message

  const { isSelectMessages, setSelectedMessage } = useChatSlice()
  const [showNotch, setShowNotch] = useState(false)

  const handleSelectMessage = useCallback(() => {
    setSelectedMessage(_id)
  }, [_id, setSelectedMessage])

  useEffect(() => {
    if (!isNextMessageUsMine || isLastMessagae) {
      setShowNotch(true)
    }
  }, [isNextMessageUsMine, isLastMessagae])

  const Messageprops = {
    message,
    currentUserMessage,
    allSeen,
    showNotch,
  }

  const renderMessageContent = () => {
    switch (messageType) {
      case 'TEXT_MESSAGE':
        return <TextMessage {...Messageprops} />
      case 'VIDEO':
        return <VideoMessage {...Messageprops} />
      case 'AUDIO':
      case 'VOICE_MESSAGE':
        return <AudioMessage {...Messageprops} />
      case 'POST_MESSAGE':
        return <PostMessage {...Messageprops} />
      case 'IMAGE':
        return <ImageMessage {...Messageprops} />
      default:
        return null
    }
  }

  const className = clsx(
    'w-full transition-colors duration-500 flex mb-1',
    isSelectMessages && 'hover:bg-zinc-900 hover:bg-opacity-30',
    isMessageSelected && 'bg-zinc-900 bg-opacity-30'
  )

  return (
    <MessageWrap
      className={className}
      isSelectMessages={isSelectMessages}
      isMessageSelected={isMessageSelected}
      handleSelectMessage={handleSelectMessage}
      currentUserMessage={currentUserMessage}
      sender={message.sender}
      messageId={message._id}
      showNotch={showNotch}
    >
      {renderMessageContent()}
    </MessageWrap>
  )
}

export default memo(Message)
