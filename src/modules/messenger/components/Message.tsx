import { memo, useCallback } from 'react'
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
  isPreviousMessageIsUrs: boolean
}

const Message = ({
  currentUserMessage,
  seen: allSeen,
  isMessageSelected,
  message,
  isNextMessageUsMine,
  isLastMessagae,
  isPreviousMessageIsUrs,
}: MessageProps) => {
  const { messageType, _id } = message

  const { isSelectMessages, setSelectedMessage } = useChatSlice()

  const handleSelectMessage = useCallback(() => {
    if (isSelectMessages) {
      setSelectedMessage(_id)
    }
  }, [_id, setSelectedMessage])

  const showNotch = !isNextMessageUsMine || isLastMessagae

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
    'w-full transition-colors duration-300 flex mb-1',
    isSelectMessages && 'hover:bg-zinc-950',
    isMessageSelected && 'bg-zinc-950 bg-opacity-60'
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
      showProfile={!(isPreviousMessageIsUrs || currentUserMessage)}
      message={message}
    >
      {renderMessageContent()}
    </MessageWrap>
  )
}

export default memo(Message)
