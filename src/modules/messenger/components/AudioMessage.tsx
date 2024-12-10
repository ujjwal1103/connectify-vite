import { cn } from '@/lib/utils'

import { memo, useState } from 'react'
import { AudioPlayer } from './AudioPlayer'
import MetaData from './MetaData'

const AudioMessage = ({
  currentUserMessage,
  message,
  allSeen,
  showNotch,
  isLoading = false,
}: any) => {
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)

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
      <div className="h-24 overflow-hidden break-words">
        <AudioPlayer
          src={message.attachments[0]}
          getDurationAndCurrentTime={(
            duration: number,
            currentTime: number
          ) => {
            setDuration(duration)
            setCurrentTime(currentTime)
          }}
        />
      </div>

      <MetaData
        createdAt={message.createdAt}
        currentUserMessage={currentUserMessage}
        isLoading={isLoading}
        allSeen={allSeen}
        seen={message.seen}
        className="absolute bottom-3 right-3 "
        duration={duration}
        currentTime={currentTime}
        showTimeStamp={true}
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

export default memo(AudioMessage)
