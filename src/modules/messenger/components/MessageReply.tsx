import { useChatSlice } from '@/redux/services/chatSlice'
import { XIcon } from 'lucide-react'

const MessageReply = () => {
  const { currentMessageReply, setCurrentMessageReply } = useChatSlice()

  if (!currentMessageReply) return null

  return (
    <div className="flex rounded border border-l-4 px-2 py-px">
      <div>
        <span className="text-xs">{currentMessageReply.sender}</span>
        <p className="line-clamp-2">{currentMessageReply.message.text || "Image"} </p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {currentMessageReply?.message?.messageType === 'IMAGE' && <div>
          <img src={currentMessageReply.message.attachments[0]} className='w-10 h-8 rounded-md'/>
          </div>}
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
