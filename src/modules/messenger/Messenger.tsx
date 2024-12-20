import { Suspense, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { MessagesSquare } from 'lucide-react'

import { useChatSlice } from '@/redux/services/chatSlice'
import { getChatByChatId } from '@/api'
import { IChat } from '@/lib/types'
import ChatList from './components/ChatList'

const NoSelectedChat = () => {
  return (
    <div className="t hidden h-screen flex-1 items-center justify-center md:flex lg:flex dark:text-gray-50">
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white p-2 dark:text-gray-50">
          <MessagesSquare size={40} />
        </div>
        <h1 className="dark:text-gray-50">Your Messages</h1>
        <p>Send private photos and messages to a friend or group</p>
      </div>
    </div>
  )
}

const Messenger = () => {
  const { chatId } = useParams()
  const { selectedChat, setSelectedChat, setMessagePage, setMessages } =
    useChatSlice()

  const selectThisChat = (chat: IChat) => {
    setMessagePage(1)
    setMessages([])
    setSelectedChat(chat)
  }

  const fetchChat = async () => {
    try {
      const res = (await getChatByChatId(chatId)) as any
      if (res.isSuccess) {
        selectThisChat(res.chat)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!selectedChat && chatId) {
      fetchChat()
    }
  }, [])

  return (
    <div className="flex flex-1">
        <ChatList />
      {chatId ? (
        <Suspense fallback={<div>Loading messenger</div>}>
          <Outlet />
        </Suspense>
      ) : (
        <div className="hidden w-full flex-1 md:block md:flex-1">
          <NoSelectedChat />
        </div>
      )}
    </div>
  )
}
export default Messenger
