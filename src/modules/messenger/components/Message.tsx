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

const RenderMessage = (props: any) => {
  const Component = messageMapping[props.message.messageType]
  return Component ? <Component {...props} /> : null
}

interface MessageProps {
  currentUserMessage: boolean
  isMessageSelected: boolean
  message: IMessage
  isNextMessageUsMine: boolean
  isLastMessagae: boolean
  isPreviousMessageIsUrs: boolean
}

const Message = ({ message, isPreviousMessageIsUrs }: MessageProps) => {

  const renderSystemMessage = () => {
    return message.text.replace(getCurrentName(), 'You')
  }
  

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
      sender={message.sender}
      messageId={message._id}
      showProfile={!(isPreviousMessageIsUrs || message.isCurrentUserMessage)}
      message={message}
    >
      <RenderMessage message={message} allSeen={true} />
    </MessageWrap>
  )
}

export default Message
