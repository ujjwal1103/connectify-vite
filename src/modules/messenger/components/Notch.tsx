import BubbleNotch from '@/components/icons/BubbleNotch'
import { memo } from 'react'

function Notch({ currentUserMessage }: any) {
  return (
    <div
      className={`absolute bottom-0 z-[-1] ${
        currentUserMessage ? '-right-2' : '-left-2'
      }`}
    >
      <BubbleNotch
        className={`${currentUserMessage ? 'fill-zinc-800' : 'fill-black'}`}
        style={{
          transform: !currentUserMessage ? 'rotateY(180deg)' : 'rotate(360deg)',
        }}
      />
    </div>
  )
}

export default memo(Notch)
