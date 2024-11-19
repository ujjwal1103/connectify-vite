import BubbleNotch from '@/components/icons/BubbleNotch'
import { memo } from 'react'

function Notch({ currentUserMessage }: any) {
  return (
    <div
      className={`absolute flex bottom-0 z-[-3] ${
        currentUserMessage ? '-right-5' : '-left-5'
      }`}
    >
      <BubbleNotch
        className={`${currentUserMessage ? 'fill-red-500 ' : 'fill-chat-bubble-user'}`}
        style={{
          transform: !currentUserMessage ? 'rotateY(180deg)' : 'rotate(360deg)',
        }}
      />

    </div>
  )
}

export default memo(Notch)
