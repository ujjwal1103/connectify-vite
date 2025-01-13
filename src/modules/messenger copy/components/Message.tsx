import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'

import { useChatSlice } from '@/redux/services/chatSlice'
import TextMessage from './TextMessage'
import ImageMessage from './ImageMessage'
import VideoMessage from './VideoMessage'
import AudioMessage from './AudioMessage'
import PostMessage from './PostMessage'
import MessageWrap from './MessageWrap'
import { IMessage } from '@/lib/types'
import { getCurrentName } from '@/lib/localStorage'

const messageMapping: { [key: string]: React.ComponentType<any> } = {
  TEXT_MESSAGE: TextMessage,
  VIDEO: VideoMessage,
  AUDIO: AudioMessage,
  VOICE_MESSAGE: AudioMessage,
  POST_MESSAGE: PostMessage,
  IMAGE: ImageMessage,
}

const RenderMessage = (props:any) => {
  console.log({ins: props.message})
  const Component = messageMapping[props.message.messageType]
  return Component ? <Component {...props} /> : null
}
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
  message: msg,
  // isNextMessageUsMine,
  // isLastMessagae,
  isPreviousMessageIsUrs,
}: MessageProps) => {
  const [message, setMessage] = useState(msg)
  const { _id } = message

  useEffect(() => {
    setMessage(msg)
    console.log(msg)
  }, [msg])

  const { isSelectMessages, setSelectedMessage } = useChatSlice()

  const handleSelectMessage = useCallback(() => {
    if (isSelectMessages) {
      setSelectedMessage(_id)
    }
  }, [_id, setSelectedMessage])


  const renderSystemMessage = () => {
    return message.text.replace(getCurrentName(), 'You')
  }

  const className = clsx(
    'w-full transition-colors duration-300 flex mb-1',
    isSelectMessages && 'hover:bg-zinc-950',
    isMessageSelected && 'bg-zinc-950 bg-opacity-60'
  )

  if (message.messageType === 'SYSTEM') {
    return (
      <div className="flex items-center justify-center">
        <div className="my-1 w-fit rounded-md bg-background/50 p-2 px-4 text-center">
          {renderSystemMessage()}
        </div>
      </div>
    )
  }

  return (
    <MessageWrap
      key={message.text}
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
      <RenderMessage message={message} allSeen={allSeen} />
    </MessageWrap>
  )
}

export default Message
