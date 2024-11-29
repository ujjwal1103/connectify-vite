import { useChatSlice } from '@/redux/services/chatSlice'
import { XIcon } from 'lucide-react'


const MessageReply = () => {
  const { currentMessageReply, setCurrentMessageReply } = useChatSlice()

  if (!currentMessageReply) return null

  return (
    <div className="flex rounded border border-l-4 px-2 py-px">
      <div>
        <span className="text-xs">{currentMessageReply.sender}</span>
        <p className='line-clamp-2'>{currentMessageReply.message.text}</p>
      </div>
      <div className="ml-auto flex items-center">
        <button
          onClick={() => {
            setCurrentMessageReply(null)
          }}
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  )
}

export default MessageReply
