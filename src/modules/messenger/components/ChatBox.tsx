import ChatInfo from './ChatInfo'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import MessageListHeader from './MessageListHeader'
import { AnimatePresence, motion } from 'framer-motion'
import { useChatSlice } from '@/redux/services/chatSlice'

const ChatBox = () => {
  const {showChatInfo} = useChatSlice()

  return (
    <div className="relative bg-chat-background flex h-dvh max-h-dvh min-h-dvh w-full min-w-80 flex-1 md:flex-1">
      <div className="flex flex-1 flex-col">
        <MessageListHeader/>
        <MessageList />
        <MessageInput />
      </div>

      <AnimatePresence>
        {showChatInfo && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 100 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 z-100 h-dvh border-l border-border bg-background md:static"
          >
            <ChatInfo/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default ChatBox
