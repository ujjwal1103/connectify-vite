import ChatInfo from './ChatInfo'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import MessageListHeader from './MessageListHeader'
import { AnimatePresence } from 'framer-motion'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const ChatBox = () => {
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  )
  const { showChatInfo } = useChatSlice()

  return (
    <div className="relative flex h-dvh max-h-dvh min-h-dvh w-full min-w-80 flex-1 bg-chat-background md:flex-1">
      <div className="flex flex-1 flex-col">
        <MessageListHeader selectedChat={selectedChat} />
        <MessageList />
        <MessageInput />
      </div>
      <AnimatePresence>{showChatInfo && <ChatInfo />}</AnimatePresence>
    </div>
  )
}
export default ChatBox
